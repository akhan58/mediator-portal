// authController.js (Back End - Authentication Controller)
// This part handles user authentication. It exports two functions:
// - signup: Validates input, checks if the user already exists, hashes the password using bcrypt,
//   and adds the new user to an in-memory store.
// - login: Validates user credentials and, if correct, generates a JWT token valid for 1 hour.
// So in a nutshell this controller is used on the backend to manage user signup and login processes.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/user');  // For now using a mock in-memory store

// Signup function
exports.signup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User created' });
};

// Login function
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
