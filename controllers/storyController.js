const SuccessStory = require('../models/SuccessStory');
const { stories: fallbackStories } = require('../utils/fallbackData');
const mongoose = require('mongoose');

// Helper to check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all success stories with user like status
// @route   GET /api/stories
// @access  Public
const getAllStories = async (req, res) => {
    try {
        const { category, feeling, sort = 'newest', limit = 20 } = req.query;
        const userId = req.user?._id;

        if (!isDbConnected()) {
            let filteredStories = fallbackStories.filter(story => story.isApproved);
            
            if (category) {
                filteredStories = filteredStories.filter(story => story.category === category);
            }
            if (feeling) {
                filteredStories = filteredStories.filter(story => story.feeling === feeling);
            }
            
            // Add hasLiked status for fallback
            if (userId) {
                const userLikes = fallbackLikes.get(userId) || new Set();
                filteredStories = filteredStories.map(story => ({
                    ...story,
                    hasLiked: userLikes.has(story._id)
                }));
            }
            
            // Sort stories
            if (sort === 'likes') {
                filteredStories.sort((a, b) => b.likes - a.likes);
            } else {
                filteredStories.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            }
            
            const limitedStories = filteredStories.slice(0, parseInt(limit));
            
            return res.json({
                success: true,
                count: limitedStories.length,
                data: limitedStories
            });
        }

        let query = { isApproved: true };

        if (category) {
            query.category = category;
        }

        if (feeling) {
            query.feeling = feeling;
        }

        let sortOption = {};
        if (sort === 'likes') {
            sortOption = { likes: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        const stories = await SuccessStory.find(query)
            .sort(sortOption)
            .limit(parseInt(limit));

        // Add hasLiked status for each story
        const storiesWithLikeStatus = stories.map(story => ({
            ...story.toObject(),
            hasLiked: userId ? story.likedBy.includes(userId) : false
        }));

        res.json({
            success: true,
            count: storiesWithLikeStatus.length,
            data: storiesWithLikeStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add a new success story (anonymous)
// @route   POST /api/stories
// @access  Public
const addStory = async (req, res) => {
    try {
        const { situation, whatISaid, outcome, feeling, category } = req.body;

        const story = await SuccessStory.create({
            situation,
            whatISaid,
            outcome,
            feeling: feeling || 'proud',
            category: category || 'general',
            isAnonymous: true,
            isApproved: true
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for sharing your story! It will inspire others.',
            data: story
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// In-memory like tracking for fallback
let fallbackLikes = new Map();
let fallbackTipLikes = new Map();

// Clear all likes on server restart
fallbackLikes.clear();
fallbackTipLikes.clear();

// Reset fallback data likes to 0
const fallbackData = require('../utils/fallbackData');
fallbackData.stories.forEach(story => {
    story.likes = 0;
    story.likedBy = [];
});

// @desc    Like/Unlike a success story
// @route   POST /api/stories/:id/like
// @access  Private
const likeStory = async (req, res) => {
    try {
        const userId = req.user._id;
        const storyId = req.params.id;

        if (!isDbConnected()) {
            // Fallback like system
            const userLikes = fallbackLikes.get(userId) || new Set();
            const story = fallbackStories.find(s => s._id === storyId);
            
            if (!story) {
                return res.status(404).json({
                    success: false,
                    message: 'Story not found'
                });
            }

            const hasLiked = userLikes.has(storyId);
            
            if (hasLiked) {
                userLikes.delete(storyId);
                story.likes = Math.max(0, story.likes - 1);
            } else {
                userLikes.add(storyId);
                story.likes += 1;
            }
            
            fallbackLikes.set(userId, userLikes);
            
            return res.json({
                success: true,
                data: { 
                    likes: story.likes, 
                    hasLiked: !hasLiked,
                    action: hasLiked ? 'unliked' : 'liked'
                }
            });
        }

        const story = await SuccessStory.findById(storyId);
        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        // Check if user already liked this story
        const hasLiked = story.likedBy.includes(userId);
        
        if (hasLiked) {
            // Unlike: remove user from likedBy array and decrease likes
            story.likedBy = story.likedBy.filter(id => id.toString() !== userId.toString());
            story.likes = Math.max(0, story.likes - 1);
        } else {
            // Like: add user to likedBy array and increase likes
            story.likedBy.push(userId);
            story.likes += 1;
        }

        await story.save();

        res.json({
            success: true,
            data: { 
                likes: story.likes, 
                hasLiked: !hasLiked,
                action: hasLiked ? 'unliked' : 'liked'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get feeling options
// @route   GET /api/stories/feelings
// @access  Public
const getFeelings = async (req, res) => {
    try {
        const feelings = [
            { id: 'proud', name: 'Proud', emoji: '🏆' },
            { id: 'relieved', name: 'Relieved', emoji: '😌' },
            { id: 'empowered', name: 'Empowered', emoji: '💪' },
            { id: 'nervous-but-glad', name: 'Nervous but Glad', emoji: '😅' },
            { id: 'confident', name: 'Confident', emoji: '😎' }
        ];

        res.json({
            success: true,
            data: feelings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllStories,
    addStory,
    likeStory,
    getFeelings
};
