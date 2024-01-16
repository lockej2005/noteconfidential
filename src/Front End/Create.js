import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from './styles'; // assuming your styles are correctly imported

function CreatePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleCreate = (event) => {
        event.preventDefault();
        // Implement your logic to create a new note here.
        console.log(title, content);
        // Redirect to dashboard or show a success message
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
                <button type="submit" style={styles.widerButton} onClick={() => navigate('/Dashboard')}>Create</button>
            </form>
        </div>
    );
}

export default CreatePage;
