const express = require('express');
const router = express.Router();
const {
    getAllTips,
    getTipsByCategory,
    addTip,
    likeTip,
    getTipCategories
} = require('../controllers/tipController');
const { protect } = require('../middlewares/authMiddleware');
const { optionalAuth } = require('../middlewares/optionalAuth');
const { validate, tipValidation } = require('../middlewares/validateMiddleware');

// Public routes with optional auth for like status
router.get('/', optionalAuth, getAllTips);
router.get('/categories', getTipCategories);
router.get('/category/:category', optionalAuth, getTipsByCategory);

// Protected routes - require login
router.post('/', protect, tipValidation, validate, addTip);
router.post('/:id/like', protect, likeTip);

module.exports = router;
