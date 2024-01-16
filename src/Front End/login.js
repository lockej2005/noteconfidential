import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from './styles';

function Login() {
    const navigate = useNavigate();

    return (
        <div style={styles.defaultPage}>
            <h1 style={styles.header}>Note Confidential</h1>
            <div style={styles.buttonGroup}>
                <button 
                  style={{ ...styles.button, ...styles.activeButton }} 
                  onClick={() => navigate('/')} // Navigates to the current login page
                >
                  Login
                </button>
                <button 
                  style={styles.button} 
                  onClick={() => navigate('/signup')} // Navigates to the sign-up page
                >
                  Sign Up
                </button>
            </div>
            <form style={styles.form}>
                <input type="email" placeholder="Email" style={styles.input} />
                <input type="password" placeholder="Password" style={styles.input} />
                <button type="submit" style={styles.loginButton} onClick={() => navigate('/dashboard')} >Login</button>
            </form>
        </div>
    );
}

export default Login;
