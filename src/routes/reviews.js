const express = require('express');
const router = express.Router();
const reviewsAccessLayer = require('../models/reviewsAccessLayer');
const businessAccessLayer = require('../models/businessesAccessLayer');

const { fetchGoogleReviews } = require('./googleReviews');
const { fetchTrustpilotReviews } = require('./trustpilotReviews');
const { fetchYelpReviews } = require ('./yelpReviews');
const { fetchFacebookReviews } = require('./facebookReviews');

const { syncExternalReviews } = require('../services/reviewSyncService');

const auth = require('../middleware/auth');

// GET /api/reviews/google -- fetch and store Google reviews
router.get('/google', auth, async (req, res) => {
    try {
        // Get business profile for the logged in user
        const business = await businessAccessLayer.getBusinessByUserId(req.user.id); // from auth middleware

        if (!business) {
            return res.status(404).json({ error: "Business profile not found" });
        }
        
        if (!business.google_place_id) {
            return res.status(400).json({ error: "Google Place ID not configured" });
        }
        
        // Fetch reviews from Google API
        const {reviews, error} = await fetchGoogleReviews(business.google_place_id);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (existingReview.length === 0) {
                const storedReview = await reviewsAccessLayer.createReview(usersIdToReviews);
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

// GET /api/reviews/trustpilot -- fetch and store Trustpilot reviews
router.get('/trustpilot', auth, async (req, res) => {
    try {
        // Get business profile for the logged in user
        const business = await businessAccessLayer.getBusinessByUserId(req.user.id); // from auth middleware

        if (!business) {
            return res.status(404).json({ error: "Business profile not found" });
        }
        
        if (!business.trustpilot_businessunit_id) {
            return res.status(400).json({ error: "Trustpilot Business Unit ID not configured" });
        }

        // Fetch reviews from Trustpilot API
        const {reviews, error} = await fetchTrustpilotReviews(business.trustpilot_businessunit_id);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (existingReview.length === 0) {
                const storedReview = await reviewsAccessLayer.createReview(usersIdToReviews);
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

// GET /api/reviews/yelp -- fetch and store Yelp reviews
router.get('/yelp', auth, async (req, res) => {
    try {
        // Get business profile for the logged in user
        const business = await businessAccessLayer.getBusinessByUserId(req.user.id); // from auth middleware

        if (!business) {
            return res.status(404).json({ error: "Business profile not found" });
        }
        
        if (!business.yelp_business_id) {
            return res.status(400).json({ error: "Yelp Business ID not configured" });
        }

        // Fetch reviews from Yelp API
        const {reviews, error} = await fetchYelpReviews(business.yelp_business_id);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (existingReview.length === 0) {
                const storedReview = await reviewsAccessLayer.createReview(usersIdToReviews);
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

// GET /api/reviews/facebook -- fetch and store Facebook reviews
router.get('/facebook', auth, async (req, res) => {
    try {
        // Get business profile for the logged in user
        const business = await businessAccessLayer.getBusinessByUserId(req.user.id); // from auth middleware

        if (!business) {
            return res.status(404).json({ error: "Business profile not found" });
        }
        
        if (!business.facebook_page_id) {
            return res.status(400).json({ error: "Facebook Page ID not configured" });
        }

        // Fetch reviews from Facebook API
        const {reviews, error} = await fetchFacebookReviews(business.facebook_page_id);

        if (error) {
            return res.status(400).json({ error });
        }

        const storedReviews= [];

        for (const review of reviews) {
            // Add user_id from users table to reviews
            const usersIdToReviews = {
                ...review,
                user_id: req.user.id
            };

            // Check if reviews already exists
            const existingReview = await reviewsAccessLayer.getReviewsByPlatformAndSourceId(review.platform, review.source_id);

            // Create if reviews does not exist
            if (existingReview.length === 0) {
                const storedReview = await reviewsAccessLayer.createReview(usersIdToReviews);
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

// GET /api/reviews -- return reviews with query filters, pagination, and sorting
router.get('/', auth, async (req, res) => {
    try {
        // Extract review parameters
        const reviewFilters = {
            platform: req.query.platform,
            rating: req.query.rating ? parseInt(req.query.rating) : null,
            userId: req.query.userId ? parseInt(req.query.userId) : null
        };

        // Extract pagination parameters
        const pagination = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            offset: (req.query.page ? parseInt(req.query.page) - 1 : 0) * (req.query.limit ? parseInt(req.query.limit) : 10)
        };
        
        // Extract sorting parameters
        const sorting = {
            sortBy: req.query.sortBy || 'timestamp', // Default sort by timestamp
            sortOrder: req.query.sortOrder === 'asc' ? 'ASC' : 'DESC' // Default sort order is DESC
        };
        
        // Dispute and flagged filters
        const disputeFilters = {
            flaggedReason: req.query.flaggedReason === 'true',
            disputeStatus: req.query.disputeStatus ? parseInt(req.query.disputeStatus) : null
        };

        // Get reviews with filters, pagination and sorting
        const { reviews, totalCount } = await reviewsAccessLayer.getFilteredReviews(
            reviewFilters, 
            pagination, 
            sorting,
            disputeFilters
        );
        
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pagination.limit);
        
        res.status(200).json({
            reviews,
            pagination: {
                total: totalCount,
                page: pagination.page,
                limit: pagination.limit,
                totalPages
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/sync', auth, async (req, res) => {
    try {
        const result = await syncExternalReviews(req.user.id);

        if (!result) {
            return res.status(400).json({ error: result.error });
        }

        res.status(200).json({message: "Reviews sync successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Server error" });
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
