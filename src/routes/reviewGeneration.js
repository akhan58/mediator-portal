const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send email review request
const sendEmailReviewRequest = async (email, platform) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We Value Your Feedback!',
        text: `Hi there, we would love to hear your feedback about your recent experience with us on ${platform}. Please leave us a review!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return `Email review request sent to ${email} for ${platform}`;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Send SMS review request
const sendSMSReviewRequest = async (phoneNumber, platform) => {
    try {
        await twilioClient.messages.create({
            body: `Hi there, we would love to hear your feedback about your recent experience with us on ${platform}. Please leave us a review!`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
        return `SMS review request sent to ${phoneNumber} for ${platform}`;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('Failed to send SMS');
    }
};

// Send review request
router.post('/sendRequest', async (req, res) => {
    const { contact, platform, method } = req.body;

    try {
        let result;
        if (method === 'email') {
            result = await sendEmailReviewRequest(contact, platform);
        } else if (method === 'sms') {
            result = await sendSMSReviewRequest(contact, platform);
        } else {
            return res.status(400).json({ message: 'Invalid method. Use "email" or "sms".' });
        }

        res.json({ message: result });
    } catch (error) {
        console.error('Error sending review request:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;





/*
OLD CODE
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

module.exports = router;*/