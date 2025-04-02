const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/reviews/respond — Respond to a review
router.post('/respond', async (req, res) => {
    const { reviewId, response } = req.body;

    if (!reviewId || !response) {
        return res.status(400).json({ error: "Missing required fields: reviewId, response" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO interactions (review_id, response_text) VALUES ($1, $2) RETURNING *`,
            [reviewId, response]
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