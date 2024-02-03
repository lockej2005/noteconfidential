import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { styles } from './styles';

function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [isLoading, setIsLoading] = useState(false); // State to indicate loading

    const handleSignUp = async (event) => {
      event.preventDefault();
      setErrorMessage('');
      setIsLoading(true);
  
      if (password !== confirmPassword) {
          setErrorMessage('Passwords must match.');
          setIsLoading(false);
          return;
      }
      if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
      }
  
      try {
          const { user, session, error } = await supabase.auth.signUp({
              email,
              password,
          });
  
          if (error) {
              throw error;
          }
  
          console.log('Sign up successful, session:', session);
  
          console.log('Attempting to insert user profile...');
          const { data, insertError } = await supabase
              .from('user_profiles')
              .insert([
                  {
                      email: email,
                      name,
                  },
              ]);
  
          if (insertError) {
              throw insertError;
          }
  
          console.log('User profile insertion successful, data:', data);
          navigate('/');
      } catch (error) {
          console.error('An error occurred:', error);
          setErrorMessage(error.error_description || error.message);
      } finally {
          setIsLoading(false);
      }
  };
  
  
  
  
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
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
            {isLoading && <div>Loading...</div>} {/* Simple loading text, replace with your loading animation */}
            <form style={styles.form} onSubmit={handleSignUp}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    style={styles.input} 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                />
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
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    style={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button type="submit" style={styles.loginButton} disabled={isLoading}>Sign Up</button>
            </form>
            <a href='https://www.linkedin.com/in/lockej2005/' style={styles.link} target='_blank'><h3 style={styles.header}><u>By Joshua Locke</u></h3></a>
        </div>
    );
}

export default SignUp;
