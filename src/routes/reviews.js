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