const express = require('express');
const router = express.Router();
const reviewsAccessLayer = require('../models/reviewsAccessLayer');

const { fetchGoogleReviews } = require('./googleReviews');
const { fetchTrustpilotReviews } = require('./trustpilotReviews');
const { fetchYelpReviews } = require ('./yelpReviews');
const { fetchFacebookReviews } = require('./facebookReviews');

const { validateId } = require('../validators/idValidation');
const { validationResult } = require('express-validator');

// HTTP Route -- fetch and store Google reviews
router.get('/google/:placeId', validateId('placeId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({result: result.array() });
    }

    try {
        // Fetch reviews from Google API
        const {reviews, error} = await fetchGoogleReviews(req.params.placeId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_ID);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review);
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

// HTTP Route -- fetch and store Trustpilot reviews
router.get('/trustpilot/:businessUnitId', validateId('businessUnitId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({result: result.array() });
    }

    try {
        // Fetch reviews from Trustpilot API
        const {reviews, error} = await fetchTrustpilotReviews(req.params.businessUnitId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_ID);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review);
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

// HTTP Route -- fetch and store Yelp reviews
router.get('/yelp/:businessId', validateId('businessId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({result: result.array() });
    }

    try {
        // Fetch reviews from Yelp API
        const {reviews, error} = await fetchYelpReviews(req.params.businessId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_ID);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review);
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

// HTTP Route -- fetch and store Facebook reviews
router.get('/facebook/:pageId', validateId('pageId'), async (req, res) => {
    
    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({result: result.array() });
    }

    try {
        // Fetch reviews from Facebook API
        const {reviews, error} = await fetchFacebookReviews(req.params.pageId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_ID);

            // Create if reviews does not exist
            if (!existingReview) {
                const storedReview = await reviewsAccessLayer.createReview(review);
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