const express = require('express');
const router = express.Router();
const dataAccessLayer = require('../models/dataAccessLayer');
const { fetchGoogleReviews } = require('../routes/googleReviews');
const { fetchTrustpilotReviews } = require('../routes/trustpilotReviews');
const { fetchYelpReviews } = require('../routes/yelpReviews');
const { fetchFacebookReviews } = require('../routes/facebookReviews');

// 1. Review Retrieval Endpoint: GET /api/reviews
router.get('/', async (req, res) => {
    try {
        // Fetch external reviews from different platforms
        const googleReviews = await fetchGoogleReviews(process.env.GOOGLE_PLACE_ID);
        const trustpilotReviews = await fetchTrustpilotReviews(process.env.TRUSTPILOT_BUSINESS_ID);
        const yelpReviews = await fetchYelpReviews(process.env.YELP_BUSINESS_ID);
        const facebookReviews = await fetchFacebookReviews(process.env.FACEBOOK_PAGE_ID);

        // Fetch stored reviews from the database
        const storedReviews = await dataAccessLayer.getAllReview();

        // Merge all reviews
        const allReviews = [
            ...googleReviews.reviews || [],
            ...trustpilotReviews.reviews || [],
            ...yelpReviews.reviews || [],
            ...facebookReviews.reviews || [],
            ...storedReviews
        ];

        res.status(200).json(allReviews);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Review Response Endpoint: POST /api/reviews/respond
router.post('/respond', async (req, res) => {
    try {
        const { reviewId, responseText, platform } = req.body;

        if (!reviewId || !responseText || !platform) {
            return res.status(400).json({ error: "Missing required fields: reviewId, responseText, platform" });
        }

        // Store response in the database
        const responseStored = await dataAccessLayer.storeReviewResponse({ reviewId, responseText, platform });

        // (Optional) Forward response to external platform
        if (platform === "Google") {
            // Google API response logic here
        } else if (platform === "Yelp") {
            // Yelp API response logic here
        } else if (platform === "Facebook") {
            // Facebook API response logic here
        } else if (platform === "Trustpilot") {
            // Trustpilot API response logic here
        }

        res.status(201).json({ message: "Review response submitted successfully", responseStored });
    } catch (error) {
        console.error('Error responding to review:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
