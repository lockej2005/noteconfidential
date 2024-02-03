import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Make sure to import useAuth
import { supabase } from './supabaseClient';
import { styles } from './styles';
import CryptoJS from 'crypto-js';

function CreatePage() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Use the useAuth hook to access the user's details
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // You should move this key to an environment variable or another secure location
    const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

    const encryptText = (plainText) => {
        return CryptoJS.AES.encrypt(plainText, secretKey).toString();
    };

    const handleCreate = async (event) => {
        event.preventDefault();
        if (!user) {
            alert('You must be logged in to create a note.');
            return;
        }
        if (!title || !content) {
            alert('Please enter a title and content for your note.');
            return;
        }
    
        // Encrypt the title and content before saving
        const encryptedTitle = encryptText(title);
        const encryptedContent = encryptText(content);
    
        try {
            // Request server-side signing of the content
            const response = await fetch('http://localhost:3000/api/sign-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${user.token}` // Uncomment if you are using token-based authentication
                },
                body: JSON.stringify({ noteContent: content })
            });
    
            if (!response.ok) {
                throw new Error(`An error occurred: ${response.statusText}`);
            }
    
            const { signature } = await response.json();
    
            // Insert the encrypted note and signature into the Supabase database
            const { data, error } = await supabase
                .from('notes')
                .insert([
                    {
                        noteTitle: encryptedTitle,
                        noteText: encryptedContent,
                        uid: user.id,
                        signature: signature
                    },
                ]);
    
            if (error) {
                throw new Error('Could not create the note: ' + error.message);
            } else {
                console.log('Note created', data);
                navigate('/dashboard'); // Redirect to dashboard after note creation
            }
        } catch (error) {
            console.error('Error creating note:', error);
            alert(error.message);
        }
    };
    
    
    return (
        <div style={styles.defaultPage}>
            <h1 style={styles.header}>Create New Note</h1>
            <form style={styles.form} onSubmit={handleCreate}>
                <input 
                    style={styles.input} 
                    type="text" 
                    placeholder="Note Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <textarea 
                    style={{ ...styles.input, ...styles.textArea }} 
                    placeholder="Note Content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                />
                <button type="submit" style={styles.widerButton}>
                    Create
                </button>
            </form>
            <a href='https://www.linkedin.com/in/lockej2005/' style={styles.link} target='_blank'><h3 style={styles.header}><u>By Joshua Locke</u></h3></a>
        </div>
    );
}

export default CreatePage;
