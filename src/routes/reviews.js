// review.js (Back End - Express Router)
// This stuff here defines a simple GET endpoint (/fetchReviews) that returns mock review data.
// It currently returns a hard-coded array of review objects with details like platform, rating, date, and text.
// This mock implementation simulates an API response and should be replaced with actual API integration in the future.


const express = require('express');
const router = express.Router();

// Mock example - Replace with actual API integration
router.get('/fetchReviews', async (req, res) => {
    const reviews = [
        { platform: 'Google', rating: 4, date: '2025-01-01', text: 'Great service!' },
        { platform: 'Yelp', rating: 5, date: '2025-01-02', text: 'Amazing experience!' }
    ];
    res.json(reviews);
});

module.exports = router;