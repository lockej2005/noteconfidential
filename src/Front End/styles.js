
export const styles = {
    defaultPage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#6C7536',
        fontFamily: "'IBM Plex Mono', monospace"
    },
    header: {
        color: 'white',
        marginBottom: '2rem',
    },
    buttonGroup: {
        margin: '0.5rem',
    },
    button: {
        padding: '0.5rem 1rem',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
        fontFamily: "'IBM Plex Mono', monospace"
    },
    activeButton: {
        borderBottom: '2px solid white',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        width: '20rem',
        margin: '0.5rem 0',
        padding: '1rem',
        border: '2px solid white',
        backgroundColor: '#fff',
        color: '#6C7536',
        fontFamily: "'IBM Plex Mono', monospace",
        resize: 'vertical'
    },
    loginButton: {
        padding: '1rem',
        marginTop: '1rem',
        border: 'none',
        backgroundColor: 'black',
        color: 'white',
        cursor: 'pointer',
        fontFamily: "'IBM Plex Mono', monospace"
    },
    widerButton: {
        padding: '1rem 3rem',
        marginTop: '1rem',
        border: 'none',
        backgroundColor: 'black',
        color: 'white',
        cursor: 'pointer',
        fontFamily: "'IBM Plex Mono', monospace"
    },
    
    dashboardPage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#8c8c46', // Replace with the actual color from your design
        color: 'white',
        fontFamily: "'IBM Plex Mono', monospace", // assuming you've imported the font
    },
    createButton: {
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        padding: '0.5em 1em',
        margin: '1em',
        cursor: 'pointer',
        fontSize: '1em',
    },
    notesList: {
        width: '80%',
        maxWidth: '600px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        padding: '1em',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    noteItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '5px',
        padding: '0.5em 1em',
        margin: '0.5em 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noteTitle: {
        fontWeight: '500',
        color: 'white',
    },
    noteDate: {
        fontSize: '0.85em',
        fontStyle: 'italic',
        color: 'white',
    },
    logoutButton: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '2px solid white',
        padding: '0.5em 1em',
        margin: '1em',
        cursor: 'pointer',
        fontSize: '1em',
    },
    textArea: {
        height: '150px', // Set to the desired height for your text area
        width: '20rem',
        margin: '0.5rem 0',
        padding: '1rem',
        border: '2px solid white',
        backgroundColor: '#fff',
        color: '#6C7536',
        fontFamily: "'IBM Plex Mono', monospace",
        resize: 'vertical'
    },
};
