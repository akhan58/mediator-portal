const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // Enable cross-origin requests

// Initialize Passport
app.use(passport.initialize());

app.use(express.json()); // Enable JSON parsing

// Authentication Routes
app.use('/auth', require('./src/routes/auth'));

// Register Review Routes (Updated)
const reviewRoutes = require('./src/routes/reviews');
app.use('/api/reviews', reviewRoutes);

const reviewGenRoutes = require('./src/routes/reviewGeneration');
app.use('/api/reviewGeneration', reviewGenRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
