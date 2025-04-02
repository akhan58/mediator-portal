const express = require('express');
const router = express.Router();
const axios = require('axios');

const disputesAccessLayer = require('../models/disputesAccessLayer');

const { validateInt, validateDisputeStatusBody, validateStatusParam } = require('../validators/idValidation');
const { validationResult } = require('express-validator');

// HTTP Route -- call the Flask API
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

// HTTP Route -- get dipsutes by id
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

// HTTP Route - get dispute by review_id
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

// HTTP Route -- get dispute by status
router.get('/status/:disputeStatus', validateStatusParam, async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({errors: result.array() });
    }

    try {
        const dispute = await disputesAccessLayer.getDisputesByStatus(req.params.status);
        if (!dispute) {
            return res.status(404).json({error: 'Dispute not found' });
        }
        res.status(200).json(dispute);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to get dispute by status"});
    }
});

// HTTP Route -- update dispute status
router.put('/:disputeId', validateInt('disputeId'), validateDisputeStatusBody, async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({result: result.array() });
    }

    try {
        const {dispute_status} = req.body;
        const dispute = await disputesAccessLayer.updateDispute({
            dispute_id: req.params.disputeId,
            dispute_status
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

// HTTP Route -- delete dispute
router.delete('/:disputeId', validateInt('disputeId'), async (req, res) => {

    // Extract validation error into a result object
    const result = validationResult(req);
    if (!result.isEmpty()){
        return res.status(400).json({result: result.array() });
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


module.exports = router;