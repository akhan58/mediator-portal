const express = require('express');
const router = express.Router();
const axios = require('axios');
const Review = require('../models/review');
require('dotenv').config();

// Fetch reviews from Google My Business API
const fetchGoogleReviews = async (businessId) => {
    try {
        const response = await axios.get(
            `https://mybusiness.googleapis.com/v4/accounts/${businessId}/locations/{locationId}/reviews`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
                },
            }
        );

        return response.data.reviews.map((review) => ({
            platform: 'Google',
            rating: review.rating,
            review_date: review.createTime,
            review_text: review.comment,
            business_id: businessId,
        }));
    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        throw error;
    }
};

// Fetch reviews from Yelp API
const fetchYelpReviews = async (businessId) => {
    try {
        const response = await axios.get(
            `https://api.yelp.com/v3/businesses/${businessId}/reviews`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.YELP_API_KEY}`,
                },
            }
        );

        return response.data.reviews.map((review) => ({
            platform: 'Yelp',
            rating: review.rating,
            review_date: review.time_created,
            review_text: review.text,
            business_id: businessId,
        }));
    } catch (error) {
        console.error('Error fetching Yelp reviews:', error);
        throw error;
    }
};

// Fetch and store reviews
router.get('/fetchReviews', async (req, res) => {
    const { businessId } = req.query;

    try {
        const googleReviews = await fetchGoogleReviews(businessId);
        const yelpReviews = await fetchYelpReviews(businessId);
        const allReviews = [...googleReviews, ...yelpReviews];

        await Review.bulkCreate(allReviews);
        res.json({ message: 'Reviews fetched and stored successfully', reviews: allReviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});

// Get all reviews for a business
router.get('/getReviews', async (req, res) => {
    const { businessId } = req.query;

    try {
        const reviews = await Review.findAll({ where: { business_id: businessId } });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews from database:', error);
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});

// Respond to a review
router.post('/respond', async (req, res) => {
    const { reviewId, response } = req.body;

    try {
        // Update the review with the response
        await Review.update({ response }, { where: { id: reviewId } });
        res.json({ message: 'Response submitted successfully' });
    } catch (error) {
        console.error('Error submitting response:', error);
        res.status(500).json({ message: 'Error submitting response', error });
    }
});

// Flag a review for dispute
router.post('/flagDispute', async (req, res) => {
    const { reviewId, reason } = req.body;

    try {
        // Update the review with the dispute flag
        await Review.update({ dispute_reason: reason, is_disputed: true }, { where: { id: reviewId } });
        res.json({ message: 'Review flagged for dispute successfully' });
    } catch (error) {
        console.error('Error flagging review for dispute:', error);
        res.status(500).json({ message: 'Error flagging review for dispute', error });
    }
});

// Flag a review for outreach
router.post('/flagOutreach', async (req, res) => {
    const { reviewId } = req.body;

    try {
        // Update the review with the outreach flag
        await Review.update({ is_outreach: true }, { where: { id: reviewId } });
        res.json({ message: 'Review flagged for outreach successfully' });
    } catch (error) {
        console.error('Error flagging review for outreach:', error);
        res.status(500).json({ message: 'Error flagging review for outreach', error });
    }
});



module.exports = router;