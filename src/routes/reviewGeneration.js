const express = require('express');
const router = express.Router();

// Mock function to send review request - Replace with actual email/SMS API
const sendReviewRequest = async (contact, platform) => {
    // Implement email/SMS sending logic here
    return `Review request sent to ${contact} for ${platform}`;
};

router.post('/sendRequest', async (req, res) => {
    const { contact, platform } = req.body;
    const result = await sendReviewRequest(contact, platform);
    res.json({ message: result });
});

module.exports = router;