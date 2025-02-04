const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Initialize Passport
app.use(passport.initialize());

app.use(express.json()); // To parse JSON data

// Routes, line to connect the routes
app.use('/auth', require('./src/routes/auth'));

// Connect the review routes
const reviewRoutes = require('./src/routes/reviews');
app.use('/api/reviews', reviewRoutes);

const reviewGenRoutes = require('./src/routes/reviewGeneration');
app.use('/api/reviewGeneration', reviewGenRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));