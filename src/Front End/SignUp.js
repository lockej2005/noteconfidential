import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from './styles';

function SignUp() {
    const navigate = useNavigate();

    return (
        <div style={styles.defaultPage}>
            <h1 style={styles.header}>Note Confidential</h1>
            <div style={styles.buttonGroup}>
                <button 
                  style={styles.button} 
                  onClick={() => navigate('/')} // Navigates back to the login page
                >
                  Login
                </button>
                <button 
                  style={{ ...styles.button, ...styles.activeButton }} 
                  onClick={() => navigate('/signup')} // Stays on the current sign-up page
                >
                  Sign Up
                </button>
            </div>
            <form style={styles.form}>
                <input type="name" placeholder="Name" style={styles.input} />
                <input type="email" placeholder="Email" style={styles.input} />
                <input type="password" placeholder="Password" style={styles.input} />
                <input type="password" placeholder="Confirm Password" style={styles.input} />
                <button type="submit" style={styles.loginButton} onClick={() => navigate('/')}>Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
