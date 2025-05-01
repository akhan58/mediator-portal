// server.js (Back End - Express Server Entry Point)
// This is where it all sets up and starts the Express server. It loads environment variables,
// initializes Passport for authentication, and parses JSON data.
// It then mounts the authentication routes (/auth), review-related routes (/api/reviews),
// and review request generation routes (/api/reviewGeneration). Finally, it listens on the specified port.

const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors()); // This is required for the frontend and backend to talk to each other.

// Initialize Passport
app.use(passport.initialize());

app.use(express.json()); // To parse JSON data

// Routes
app.use("/auth", require("./src/routes/auth"));
app.use("/api/reviews", require("./src/routes/reviews"));
app.use("/api/disputes", require("./src/routes/disputes")); // I can't believe I had to add this.
app.use("/api/reviewGeneration", require("./src/routes/reviewGeneration"));
app.use("/api/mock-reviews", require("./src/routes/mockReviews"));
app.use("/api/interactions", require("./src/routes/interactions"));
app.use("/api/business", require("./src/routes/business"));

// ✅ New route for review responses (Task #3)
const reviewResponseRoutes = require("./src/routes/reviewResponse");
app.use("/api/review-response", reviewResponseRoutes);

// You can enable dispute routes once the file is finalized
// const disputeRoutes = require('./src/routes/disputes');
// app.use('/api/disputes', disputeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
