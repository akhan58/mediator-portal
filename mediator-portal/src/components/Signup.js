// Signup.js (Front End - React Component)
// This component renders a signup form for new users.
// It collects a username and password and sends a POST request to the backend
// endpoint (http://localhost:5000/auth/signup) to create a new account.
// An alert tells user whether the signup was successful or failed.

import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:5000/auth/signup', { username, password });
            alert('Signup successful!');
        } catch (error) {
            alert('Signup failed');
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default Signup;

