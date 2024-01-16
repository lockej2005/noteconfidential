import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styles } from './styles'; // Update this path if your styles.js is in a different location

function Note() {
    const [noteContent, setNoteContent] = useState('• Clean up bathroom\n• Wash car\n• Mow Lawn\n• Take dogs for a walk\nDon’t forget to send work emails');
    const navigate = useNavigate();
    const { id } = useParams(); // If you're using URL params to pass the note ID

    const handleSave = () => {
        // Implement save logic
        console.log('Note saved:', noteContent);
        // Possibly navigate back to dashboard or show a success message
    };

    const handleDelete = () => {
        // Implement delete logic
        console.log('Note deleted:', id);
        // Possibly navigate back to dashboard or show a confirmation message
    };

    const handleBack = () => {
        navigate('/dashboard'); // Replace with the correct path to your dashboard
    };

    return (
        <div style={styles.defaultPage}>
            <h1 style={styles.header}>Jobs for Today</h1>
            <textarea
                style={styles.textArea}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
            />
            <div style={styles.buttonGroup}>
                <button style={styles.button} onClick={handleDelete}>Delete</button>
                <button style={styles.button} onClick={handleSave}>Save</button>
            </div>
            <button style={styles.widerButton} onClick={handleBack}>Back</button>
        </div>
    );
}

export default Note;
