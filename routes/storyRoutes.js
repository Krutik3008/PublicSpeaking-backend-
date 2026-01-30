const express = require('express');
const router = express.Router();
const {
    getAllStories,
    addStory,
    likeStory,
    getFeelings
} = require('../controllers/storyController');
const { protect } = require('../middlewares/authMiddleware');
const { optionalAuth } = require('../middlewares/optionalAuth');

// Public routes with optional auth for like status
router.get('/', optionalAuth, getAllStories);
router.get('/feelings', getFeelings);

// Protected routes - require login
router.post('/', protect, addStory);
router.post('/:id/like', protect, likeStory);

module.exports = router;
