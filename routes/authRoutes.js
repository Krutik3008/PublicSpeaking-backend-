const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, registerValidation, loginValidation } = require('../middlewares/validateMiddleware');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);

module.exports = router;
