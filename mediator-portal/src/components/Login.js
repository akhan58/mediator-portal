// Login.js (Front End - React Component)
// This part is for the login screen that allows users to enter their username and password.
// When the "Login" button is clicked, it sends a POST request to the backend endpoint
// ('http://localhost:5000/auth/login') to authenticate the user. If authentication is successful,
// the returned token is saved to localStorage and a success or something like that is displayed.
// Otherwise, it shows a failure or password incorrect alert.


import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;

