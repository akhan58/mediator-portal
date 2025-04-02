// Signup.js (Front End - React Component)
// This component renders a signup form for new users.
// It collects a username and password and sends a POST request to the backend
// endpoint (http://localhost:5000/auth/signup) to create a new account.
// An alert tells user whether the signup was successful or failed.

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';//environment variable

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);//disable when signup button requested initially until process done

    const handleSignup = async () => {//input validation so no empty or less than 6 character passwords
        if (!username || !password) {
            alert('Username and password are required.');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);// set the loading state to processing
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, { username, password }, { withCredentials: true });
            alert('Signup successful!');
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed.');//if it failing to sign in give error
        } finally {
            setLoading(false);//then reset process
        }
    };

    return (//no saving password, no double clicking
        <div>
            <h2>Signup</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            <button onClick={handleSignup} disabled={loading}>{loading ? 'Signing up...' : 'Signup'}</button>
        </div>
    );
};

export default Signup;

