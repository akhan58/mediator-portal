// Login.js (Front End - React Component)
// This part is for the login screen that allows users to enter their username and password.
// When the "Login" button is clicked, it sends a POST request to the backend endpoint
// ('http://localhost:5000/auth/login') to authenticate the user. If authentication is successful,
// the returned token is saved to localStorage and a success or something like that is displayed.
// Otherwise, it shows a failure or password incorrect alert.


import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; //used environment variable instead of hardcoding the url for more security.

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);//Added loading state so it disables login button until request have been processed

    const handleLogin = async () => {//no empty requests for the username and password slots
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { username, password }, { withCredentials: true });
            alert('Login successful!');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');//error handling
        } finally {
            setLoading(false);//loading state reset when process done
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
            <button onClick={handleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </div>
    );
};

export default Login;

