import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { styles } from './styles';
import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

const decryptText = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptText = (plainText) => {
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
};

function Note() {
    const [note, setNote] = useState({ noteTitle: '', noteText: '' });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchNote(id);
        }
    }, [id]);

    const fetchNote = async (noteId) => {
        let { data: fetchedNote, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', noteId)
            .single();

        if (error) {
            console.error('Error fetching note:', error);
            navigate('/dashboard');
        } else {
            // Decrypt the note here
            setNote({
                noteTitle: decryptText(fetchedNote.noteTitle),
                noteText: decryptText(fetchedNote.noteText),
            });
        }
    };

    const handleSave = async () => {
        // Encrypt the title and content before updating
        const encryptedTitle = encryptText(note.noteTitle);
        const encryptedContent = encryptText(note.noteText);

        const { error } = await supabase
            .from('notes')
            .update({
                noteTitle: encryptedTitle,
                noteText: encryptedContent
            })
            .match({ id });

        if (error) {
            console.error('Error saving note:', error);
            alert('Could not save the note: ' + error.message);
        } else {
            alert('Note saved successfully!');
            navigate('/dashboard'); // Navigate back to the dashboard after saving
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const { error } = await supabase
                .from('notes')
                .delete()
                .match({ id });

            if (error) {
                console.error('Error deleting note:', error);
                alert('Could not delete the note: ' + error.message);
            } else {
                alert('Note deleted successfully!');
                navigate('/dashboard'); // Navigate back to the dashboard after deleting
            }
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div style={styles.defaultPage}>
            <input
                type="text"
                value={note.noteTitle}
                onChange={(e) => setNote({ ...note, noteTitle: e.target.value })}
                style={{ ...styles.input, marginBottom: '10px' }}
            />
            <textarea
                style={styles.textArea}
                value={note.noteText}
                onChange={(e) => setNote({ ...note, noteText: e.target.value })}
            />
            <div style={styles.buttonGroup}>
                <button style={styles.button} onClick={handleDelete}>Delete</button>
                <button style={styles.button} onClick={handleSave}>Save</button>
            </div>
            <button style={styles.widerButton} onClick={handleBack}>Back</button>
            <a href='https://www.linkedin.com/in/lockej2005/' style={styles.link} target='_blank'><h3 style={styles.header}><u>By Joshua Locke</u></h3></a>
        </div>
    );
}

export default Note;



