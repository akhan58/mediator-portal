// server.js (Back End - Express Server Entry Point)
// This is where it all sets up and starts the Express server. It loads environment variables,
// initializes Passport for authentication, and parses JSON data.
// It then mounts the authentication routes (/auth), review-related routes (/api/reviews),
// and review request generation routes (/api/reviewGeneration). Finally, it listens on the specified port.

const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // This is required for the frontend and backend to talk to each other.

// Initialize Passport
app.use(passport.initialize());

app.use(express.json()); // To parse JSON data

// Routes, line to connect the routes
app.use('/auth', require('./src/routes/auth'));

// Connect the review routes
const reviewRoutes = require('./src/routes/reviews');
app.use('/api/reviews', reviewRoutes);

// Conntect the dispute routes
//const disputeRoutes = require('./src/routes/disputes');
//app.use('/api/disputes', disputeRoutes);

const reviewGenRoutes = require('./src/routes/reviewGeneration');
app.use('/api/reviewGeneration', reviewGenRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect external review routes
const getReviewsRoutes = require('./src/routes/getReviews');
app.use('/api/get-reviews', getReviewsRoutes);




// Connect mock review route
const reviewMockRoutes = require('./src/routes/mockReviews');
app.use('/api/mock-reviews', reviewMockRoutes);
