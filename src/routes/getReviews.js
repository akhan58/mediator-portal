const express = require('express');
const router = express.Router();
const reviewsAccessLayer = require('../models/reviewsAccessLayer');
const { fetchGoogleReviews } = require('./googleReviews');
const { fetchTrustpilotReviews } = require('./trustpilotReviews');
const { fetchYelpReviews } = require ('./yelpReviews');
const { fetchFacebookReviews } = require('./facebookReviews');

router.get('/google/:placeId', async (req, res) => {
    try {
        const {reviews, error} = await fetchGoogleReviews(req.params.placeId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            const storedReview = await reviewsAccessLayer.createReview(review);
            storedReviews.push(storedReview);
        }

        res.status(200).json(storedReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

router.get('/trustpilot/:businessUnitId', async (req, res) => {
    try {
        const {reviews, error} = await fetchTrustpilotReviews(req.params.businessUnitId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            const storedReview = await reviewsAccessLayer.createReview(review);
            storedReviews.push(storedReview);
        }

        res.status(200).json(storedReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

router.get('/yelp/:businessId', async (req, res) => {
    try {
        const {reviews, error} = await fetchYelpReviews(req.params.businessId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            const storedReview = await reviewsAccessLayer.createReview(review);
            storedReviews.push(storedReview);
        }

        res.status(200).json(storedReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
});

router.get('/facebook/:pageId', async (req, res) => {
    try {
        const {reviews, error} = await fetchFacebookReviews(req.params.pageId);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            const storedReview = await reviewsAccessLayer.createReview(review);
            storedReviews.push(storedReview);
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