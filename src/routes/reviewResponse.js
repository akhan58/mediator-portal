const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { validateInteractionResponseTextBody } = require('../validators/idValidation');
const { validationResult } = require('express-validator');

// POST /api/review-response — Add a response to a review
router.post('/', validateInteractionResponseTextBody, async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const { reviewId, responseText } = req.body;

    try {
        const query = `
            INSERT INTO interactions (review_id, response_text)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [reviewId, responseText];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Response saved', interaction: result.rows[0] });
    } catch (err) {
        console.error('Error saving response:', err);
        res.status(500).json({ error: 'Failed to save response' });
    }
});

module.exports = router;
