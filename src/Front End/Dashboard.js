import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from './styles'; // Update this path if your styles.js is in a different location

function Dashboard() {
    const navigate = useNavigate();
    // Dummy data for the list of notes, replace with your state/data fetching logic
    // Make sure each note has a unique `id` property
    const notes = [
        { id: 1, title: 'Jobs for Today', date: '16-01-2024' },
        { id: 2, title: 'Alarm Codes for Work', date: '14-01-2024' },
        { id: 3, title: 'Birthday ideas for Alice', date: '12-01-2024' },
        { id: 4, title: 'New Years Resolutions', date: '02-01-2024' },
    ];

    const handleNoteClick = (noteId) => {
        navigate(`/note`, { state: { id: noteId } });
    };

    // Function to handle logout, replace with your actual logout logic
    const handleLogout = () => {
        // Perform logout logic here
        navigate('/');
    };

    return (
        <div style={styles.defaultPage}>
            <h1 style={styles.header}>Welcome Josh</h1>
            <button style={styles.widerButton} onClick={() => navigate('/create')}>Create +</button>
            <br></br>
            <div style={styles.notesList}>
                {notes.map((note) => (
                    <div key={note.id} style={styles.noteItem} onClick={() => handleNoteClick(note.id)}>
                        <span style={styles.noteTitle}>{note.title}</span>
                        <span style={styles.noteDate}>{note.date}</span>
                    </div>
                ))}
            </div>
            <button style={styles.widerButton} onClick={handleLogout}>Log out</button>
        </div>
    );
}

export default Dashboard;
