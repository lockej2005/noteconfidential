import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from './styles';
import { supabase } from './supabaseClient';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const session = sessionStorage.getItem('supabase.auth.token');
        if (session) {
            navigate('/dashboard'); // Redirect to dashboard if the user is already logged in
        }
    }, [navigate]); // Include navigate in the dependency array

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data: session, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error logging in:', error);
            alert(error.message);
        } else {
            console.log('Logged in:', session);
            sessionStorage.setItem('supabase.auth.token', JSON.stringify(session)); // Save the session
            navigate('/dashboard');
        }
        setLoading(false);
    };

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
            <form style={styles.form} onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" style={styles.loginButton} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <a href='https://www.linkedin.com/in/lockej2005/' style={styles.link} target='_blank'><h3 style={styles.header}><u>By Joshua Locke</u></h3></a>
        </div>
    );
}

export default Login;
