const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Log each request to the console
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request for ${req.url} - Body: `, req.body);
    next();
});

// Middleware
app.use(express.json());
app.use(cors());

// Helper function to sign a note
function signNote(noteContent, secretKey) {
    const keyUint8Array = nacl.util.decodeBase64(secretKey);
    const contentUint8Array = nacl.util.decodeUTF8(noteContent);
    const signatureUint8Array = nacl.sign.detached(contentUint8Array, keyUint8Array);
    return nacl.util.encodeBase64(signatureUint8Array);
}

// Helper function for logging errors
function logError(error, message = '') {
    console.error(`[${new Date().toISOString()}] ${message} Error: ${error.message}`);
    console.error(error.stack);
}

// API route for signing a note
app.post('/api/sign-note', async (req, res) => {
    const { noteContent } = req.body;
    const secretKey = process.env.SIGNING_SECRET_KEY;

    try {
        const signature = signNote(noteContent, secretKey);
        console.log('Signature created:', signature);
        res.json({ signature });
    } catch (error) {
        logError(error, 'Error in /api/sign-note:');
        res.status(500).json({ error: error.message });
    }
});

// API route to fetch notes for a specific user
app.get('/dashboard/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('uid', userId);

        if (error) {
            throw error;
        }

        console.log('Fetched notes for user:', userId);
        res.json(data);
    } catch (error) {
        logError(error, `Error fetching notes for user ${userId}:`);
        res.status(500).json({ error: error.message });
    }
});

// API route to fetch all notes
app.get('/api/notes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*');

        if (error) {
            throw error;
        }

        console.log('Fetched all notes');
        res.json(data);
    } catch (error) {
        logError(error, 'Error fetching all notes:');
        res.status(500).json({ error: error.message });
    }
});

// API route to create a note
app.post('/api/notes', async (req, res) => {
    const { noteTitle, noteText, uid, signature } = req.body;

    try {
        const { data, error } = await supabase
            .from('notes')
            .insert([
                { noteTitle, noteText, uid, signature }
            ]);

        if (error) {
            throw error;
        }

        console.log('Note created:', data);
        res.status(201).json(data);
    } catch (error) {
        logError(error, 'Error creating note:');
        res.status(500).json({ error: error.message });
    }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
