const express = require('express');
const router = express.Router();
const {
    getAllStories,
    addStory,
    likeStory,
    getFeelings
} = require('../controllers/storyController');

// Public routes (all stories are anonymous)
router.get('/', getAllStories);
router.get('/feelings', getFeelings);
router.post('/', addStory);
router.post('/:id/like', likeStory);

module.exports = router;
