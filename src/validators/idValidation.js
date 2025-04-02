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

const validateStatusParam = [
    param('disputeStatus')
    .notEmpty().withMessage(`disputeStatus is required`)
    .isInt({ min: 0, max: 2 }).withMessage('Status must be 0, 1, or 2')
    .toInt(),
  ];

const validateDisputeStatusBody = [
    body('dispute_status')
    .notEmpty().withMessage('dispute_status is required')
    .isInt({ min: 0, max: 2 }).withMessage('dispute_status must be 0, 1, or 2')
    .toInt()
];

module.exports = { validateId, validateInt, validateDisputeStatusBody, validateStatusParam};