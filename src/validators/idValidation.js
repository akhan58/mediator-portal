const { param, body } = require('express-validator');

const validateId = (idParam) => [
    param(idParam)
    .notEmpty().withMessage(`${idParam} is required`)
    .isString().withMessage(`${idParam} must be a string`)
    .trim()
];

const validateInt = (idParam) => [
    param(idParam)
    .notEmpty().withMessage(`${idParam} is required`)
    .isInt({ min: 1 }).withMessage(`${idParam} must be an integer`)
    .toInt()
];

const validateDisputeStatusParam = [
    param('disputeStatus')
    .notEmpty().withMessage(`disputeStatus is required`)
    .isInt({ min: 0, max: 2 }).withMessage('Status must be 0, 1, or 2')
    .toInt(),
];

const validateDisputeStatusBody = [
    body('disputeStatus')
    .notEmpty().withMessage('disputeStatus is required')
    .isInt({ min: 0, max: 2 }).withMessage('disputeStatus must be 0, 1, or 2')
    .toInt()
];

const validateInteractionResponseTextBody = [
    body('responseText')
    .notEmpty().withMessage('responseText is required')
    .isString().withMessage('responseText must be a string')
    .trim()
];

const validateInteractionsReviewIdBody = [
    body('reviewId')
    .notEmpty().withMessage('reviewId is required')
    .isInt({ min: 1 }).withMessage('reviewId must be an integer')
    .toInt()
];

module.exports = { validateId,
    validateInt, 
    validateDisputeStatusBody, 
    validateDisputeStatusParam, 
    validateInteractionResponseTextBody, 
    validateInteractionsReviewIdBody};