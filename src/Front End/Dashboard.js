import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from './styles';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

const decryptText = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) {
            throw new Error('Decryption returned empty string, possibly due to incorrect key or corrupted data.');
        }
        return decryptedText;
    } catch (error) {
        console.error('An error occurred during decryption:', error);
        return null;
    }
};

function Dashboard() {
    const { user, setUser } = useAuth();
    const [notes, setNotes] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUserName();
            fetchNotes();
        }
    }, [user]);

    const fetchUserName = async () => {
        try {
            const userEmail = user.email;
            const { data, error } = await supabase
                .from('user_profiles')
                .select('name')
                .eq('email', userEmail)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
            } else if (data) {
                setUserName(data.name);
            }
        } catch (error) {
            console.error('An error occurred while fetching the user name:', error.message);
        }
    };

    const fetchNotes = async () => {
        console.log(`Fetching notes for user with ID: ${user.id}`);
        try {
            let { data: fetchedNotes, error, status } = await supabase
                .from('notes')
                .select('*')
                .eq('uid', user.id);

            console.log(`Response status: ${status}`);
            if (error) {
                console.error('Error fetching notes:', error);
                throw error;
            }

            if (fetchedNotes) {
                const decryptedNotes = fetchedNotes.map(note => {
                    const decryptedTitle = decryptText(note.noteTitle);
                    const decryptedContent = decryptText(note.noteText);

                    if (!decryptedTitle || !decryptedContent) {
                        console.error('Failed to decrypt note:', note);
                        return null;
                    }

                    return {
                        ...note,
                        noteTitle: decryptedTitle,
                        noteText: decryptedContent,
                    };
                }).filter(note => note !== null);

                setNotes(decryptedNotes);
            } else {
                console.log('No notes were fetched.');
            }
        } catch (error) {
            console.error('An error occurred during the fetchNotes operation:', error.message);
        }
    };

    const handleNoteClick = (noteId) => {
        navigate(`/note/${noteId}`);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            sessionStorage.removeItem('supabase.auth.token'); // Clear the session
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={styles.defaultPage}>
            <h1 style={styles.header}>Welcome {userName || 'User'}!</h1>
            <button style={styles.widerButton} onClick={() => navigate('/create')}>
                Create +
            </button>
            <br />
            <div style={styles.notesList}>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            style={styles.noteItem}
                            onClick={() => handleNoteClick(note.id)}
                        >
                            <span style={styles.noteTitle}>{note.noteTitle}</span>
                            <span style={styles.noteDate}>{formatDate(note.created_at)}</span>
                        </div>
                    ))
                ) : (
                    <p style={styles.noteTitle}>You have no notes. Click Create.</p>
                )}
            </div>
            <button style={styles.widerButton} onClick={handleLogout}>
                Log out
            </button>
            <a href='https://www.linkedin.com/in/lockej2005/' style={styles.link} target='_blank'><h3 style={styles.header}><u>By Joshua Locke</u></h3></a>
        </div>
    );
}

export default Dashboard;
