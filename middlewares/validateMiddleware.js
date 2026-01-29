const { validationResult, body } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Validation rules for user registration
const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot be more than 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

// Validation rules for user login
const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Validation rules for adding a tip
const tipValidation = [
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['general', 'body-language', 'tone', 'timing', 'mindset', 'preparation'])
        .withMessage('Invalid category'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ max: 500 })
        .withMessage('Content cannot be more than 500 characters')
];

// Validation rules for generating quick script
const quickScriptValidation = [
    body('situation')
        .trim()
        .notEmpty()
        .withMessage('Situation description is required')
        .isLength({ max: 500 })
        .withMessage('Situation cannot be more than 500 characters'),
    body('tone')
        .optional()
        .isIn(['calm', 'assertive', 'friendly', 'firm'])
        .withMessage('Invalid tone')
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    tipValidation,
    quickScriptValidation
};
