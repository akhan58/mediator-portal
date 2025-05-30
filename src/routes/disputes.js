const express = require('express');
const router = express.Router();
const axios = require('axios');

const disputesAccessLayer = require('../models/disputesAccessLayer');

const { validateInt, validateDisputeStatusBody, validateDisputeStatusParam } = require('../validators/idValidation');
const { validationResult } = require('express-validator');

// POST /api/disputes/analyze/reviewId -- call the Flask API
router.post('/analyze/:reviewId', validateInt('reviewId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        const reviewId = req.params.reviewId;

        // Calling Flask API
        const response = await axios.post('http://localhost:3500/analyze-review', {
            review_id: reviewId
        });

        res.status(200).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to analyze reviews"});
    }
});

// GET /api/disputes/disputeId/disputeId -- get dipsutes by dispute_id
router.get('/disputeId/:disputeId', validateInt('disputeId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        const dispute = await disputesAccessLayer.getDisputeById(req.params.disputeId);

        if (!dispute) {
            return res.status(404).json({error: 'Dispute not found' });
        }
        res.status(200).json(dispute);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to get dispute"});
    }
});

// GET /api/disputes/reviewId/reviewId -- get dispute by review_id
router.get('/reviewId/:reviewId', validateInt('reviewId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        const dispute = await disputesAccessLayer.getDisputeByReviewId(req.params.reviewId);
        if (!dispute) {
            return res.status(404).json({error: 'Dispute not found' });
        }
        res.status(200).json(dispute);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to get dispute by review id"});
    }
});

// GET /api/disputes/status/disputeStatus -- get dispute by status
router.get('/status/:disputeStatus', validateDisputeStatusParam, async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        const dispute = await disputesAccessLayer.getDisputesByStatus(req.params.disputeStatus);
        if (!dispute) {
            return res.status(404).json({error: 'Dispute not found' });
        }
        res.status(200).json(dispute);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to get dispute by status"});
    }
});

// PUT /api/disputes/disputesId -- update dispute status
router.put('/:disputeId', validateInt('disputeId'), validateDisputeStatusBody, async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        const {disputeStatus} = req.body;
        const dispute = await disputesAccessLayer.updateDispute({
            dispute_id: req.params.disputeId,
            disputeStatus
        });

        if (!dispute) {
            return res.status(404).json({error: 'Dispute not found' });
        }
        res.status(200).json(dispute);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to update dispute status"});
    }
});

// DELETE /api/disputes/disputesId -- delete dispute
router.delete('/:disputeId', validateInt('disputeId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        const dispute = await disputesAccessLayer.deleteDispute(req.params.disputeId);

        if (!dispute) {
            return res.status(404).json({error: 'Dispute not found' });
        }
        res.status(200).json(dispute);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to delete dispute"});
    }
});

// POST /api/disputes/createCase
// Makes a new dispute case for whatever review given.
router.post('/createCase', async (req, res) => {
    try {
        const { reviewId, reason } = req.body;
        // Use the disputesAccessLayer to create a new dispute case.
        // Assuming disputesAccessLayer.createDispute exists (or you implement it there).
        const newCase = await disputesAccessLayer.createDispute({ reviewId, reason });

        if (!newCase) {
            return res.status(500).json({ error: 'Failed to create dispute case' });
        }

        res.status(201).json({ message: 'Dispute case created', disputeCase: newCase });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating dispute case' });
    }
});
module.exports = router;
