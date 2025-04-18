//authController.js (Back End - Authentication Controller)
// This part handles user authentication. It exports two functions:
// - signup: Validates input, checks if the user already exists, hashes the password using bcrypt,
//   and adds the new user to an in-memory store.
// - login: Validates user credentials and, if correct, generates a JWT token valid for 1 hour.
// So in a nutshell this controller is used on the backend to manage user signup and login processes.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../models/user'); // Mock in-memory user store

// Signup function
exports.signup = async (req, res) => {
    const { username, password, role } = req.body;

    // Check for missing credentials
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Prevent duplicate usernames
    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        // Secure password hashing using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign default role if none provided (new feature)
        const userRole = role || 'user';

        // Save user with hashed password and role (enhanced for role support)
        users.push({ username, password: hashedPassword, role: userRole });

        // Send success response including assigned role
        res.status(201).json({ message: 'User created', user: { username, role: userRole } });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Login function
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    try {
        // Compare hashed password with stored one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token that includes role in payload (new feature)
        const token = jwt.sign(
            { username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Return token to client
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error during login' });
    }
};
