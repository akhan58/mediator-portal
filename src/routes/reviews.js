const express = require('express');
const router = express.Router();
const reviewsAccessLayer = require('../models/reviewsAccessLayer');

const { fetchGoogleReviews } = require('./googleReviews');
const { fetchTrustpilotReviews } = require('./trustpilotReviews');
const { fetchYelpReviews } = require ('./yelpReviews');
const { fetchFacebookReviews } = require('./facebookReviews');

const { validateId } = require('../validators/idValidation');
const { validationResult } = require('express-validator');

// GET /api/reviews/google/placeId -- fetch and store Google reviews
router.get('/google/:placeId', validateId('placeId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        // Fetch reviews from Google API
        const {reviews, error} = await fetchGoogleReviews(req.params.placeId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            /*const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };*/

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review /*usersIdToReviews*/);
                storedReviews.push(storedReview);
            } else { // Use existing reviews
                storedReviews.push(existingReview);
            }
        }

        res.status(200).json(storedReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

// GET /api/reviews/trustpilot/businessUnitId -- fetch and store Trustpilot reviews
router.get('/trustpilot/:businessUnitId', validateId('businessUnitId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        // Fetch reviews from Trustpilot API
        const {reviews, error} = await fetchTrustpilotReviews(req.params.businessUnitId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            /*const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };*/

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review /*usersIdToReviews*/);
                storedReviews.push(storedReview);
            } else { // Use existing reviews
                storedReviews.push(existingReview);
            }
        }

        res.status(200).json(storedReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

// GET /api/reviews/yelp/businessId -- fetch and store Yelp reviews
router.get('/yelp/:businessId', validateId('businessId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        // Fetch reviews from Yelp API
        const {reviews, error} = await fetchYelpReviews(req.params.businessId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            /*const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };*/

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review /*usersIdToReviews*/);
                storedReviews.push(storedReview);
            } else { // Use existing reviews
                storedReviews.push(existingReview);
            }
        }

        res.status(200).json(storedReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

// GET /api/reviews/facebook/pageId -- fetch and store Facebook reviews
router.get('/facebook/:pageId', validateId('pageId'), async (req, res) => {
    
    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        // Fetch reviews from Facebook API
        const {reviews, error} = await fetchFacebookReviews(req.params.pageId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            /*const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };*/

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review /*usersIdToReviews*/);
                storedReviews.push(storedReview);
            } else { // Use existing reviews
                storedReviews.push(existingReview);
            }
        }

        res.status(200).json(storedReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

router.get('/all', async (req, res) => {
    try {
        const allReviews = await reviewsAccessLayer.getAllReview();
        res.status(200).json(allReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

/* OLD CODE
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
*/