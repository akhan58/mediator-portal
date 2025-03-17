const express = require('express');
const router = express.Router();

const mockReviews = [
    {
        "review_ID": 1,
        "platform": "Google",
        "rating": 4,
        "content": "Great service!",
        "timestamp": "2025-01-01T06:00:00.000Z"
    },
    {
        "review_ID": 2,
        "platform": "Yelp",
        "rating": 5,
        "content": "Amazing experience!",
        "timestamp": "2025-01-02T06:00:00.000Z"
    },
    {
        "review_ID": 3,
        "platform": "Trustpilot",
        "rating": 3,
        "content": "Its's okay!",
        "timestamp": "2025-01-03T06:00:00.000Z"
    },
    {
        "review_ID": 4,
        "platform": "Facebook",
        "rating": 2,
        "content": "Could be better!",
        "timestamp": "2025-01-04T06:00:00.000Z"
    }
];

// Mock endpoint to get all reviews
router.get('/all', async (req, res) => {
    try {
        res.status(200).json(mockReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Mock endpoint to get reviews by platform
router.get('/:platform', async (req, res) => {
    try {
        const platform = req.params.platform;
        const filteredReviews = mockReviews.filter(review => review.platform.toLowerCase() === platform.toLowerCase());
        res.status(200).json(filteredReviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Mock endpoint to create a review
router.post('/', async (req, res) => {
    try {
        const newReview = {
            platform: req.body.platform,
            rating: req.body.rating,
            content: req.body.content,
            timestamp: req.body.timestamp
        };
        mockReviews.push(newReview);
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Mock endpoint to update a review
router.put('/:review_ID', async (req, res) => {
    try {
        const review_ID = parseInt(req.params.review_ID);
        const reviewIndex = mockReviews.findIndex(review => review.review_ID === review_ID);
        if (reviewIndex !== -1) {
            mockReviews[reviewIndex] = {
                ...mockReviews[reviewIndex],
                rating: req.body.rating,
                content: req.body.content,
                timestamp: req.body.timestamp
            };
            res.status(200).json(mockReviews[reviewIndex]);
        } else {
            res.status(404).json({ error: "Review not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Mock endpoint to delete a review
router.delete('/:review_ID', async (req, res) => {
    try {
        const review_ID = parseInt(req.params.review_ID);
        const reviewIndex = mockReviews.findIndex(review => review.review_ID === review_ID);
        if (reviewIndex !== -1) {
            const deletedReview = mockReviews.splice(reviewIndex, 1);
            res.status(200).json(deletedReview);
        } else {
            res.status(404).json({ error: "Review not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;