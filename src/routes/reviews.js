const express = require('express');
const router = express.Router();
const reviewsAccessLayer = require('../models/reviewsAccessLayer');
const pool = require('../config/db');

// GET /api/reviews — Return all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await reviewsAccessLayer.getAllReview();
        res.status(200).json(reviews);
    } catch (err) {
        console.error('Error fetching all reviews:', err);
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
});

// POST /api/reviews/respond — Respond to a review
router.post('/respond', async (req, res) => {
    const { review_ID, response_text } = req.body;

    if (!review_ID || !response_text) {
        return res.status(400).json({ error: "Missing required fields: review_ID, response_text" });
    }

    try {
        const result = await pool.query(
            `UPDATE reviews SET response_text = $1 WHERE review_ID = $2 RETURNING *`,
            [response_text, review_ID]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Response saved successfully', review: result.rows[0] });
    } catch (err) {
        console.error('Error responding to review:', err);
        res.status(500).json({ error: 'Server error while responding to review' });
    }
});

module.exports = router;
