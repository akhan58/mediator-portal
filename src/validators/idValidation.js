const { param } = require('express-validator');

const validateId = (idParam) => [
    param(idParam)
    .notEmpty().withMessage(`${idParam} is required`)
    .isString().withMessage(`${idParam} must be a string`)
    .trim()
];

module.exports = { validateId };