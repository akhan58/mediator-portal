//This will handle login and signup API routes.
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const users = require('../models/user');
const router = express.Router();

// Signup Route
//Verifies that all required fields are provided.
//Checks if the username is already in use.
//Hashes the password using bcrypt and stores the user in memory (temporary).
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password) {
        console.log("Username or password missing")
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const userExists = await users.getUsers(username);
    console.log(userExists)
    if (userExists) {
        console.log("User already exists")
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    users.createUsers({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User created' });
});


// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/dashboard');
    });

// Facebook OAuth route
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/dashboard');
    });

/*// Yelp OAuth route (example, modify based on actual usage)
router.get('/yelp', passport.authenticate('yelp'));

router.get('/yelp/callback', passport.authenticate('yelp', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/dashboard');
    });*/

// Login Route
//Validates the username and password.
//Uses bcrypt to compare the provided password with the hashed password in memory.
//Generates a JWT using the jsonwebtoken library for secure session handling.
router.post('/login', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    console.log(`Beginning login sequence for ${username}, ${password}`)
    
    if (username == null || password == null) {
        return res.status(400).json({ message: 'Username or password is undefined' })
    }

    // Find user
    const user = await users.getUsers(username);
    console.log(user)
    if (user == null) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token });
});

module.exports = router;
