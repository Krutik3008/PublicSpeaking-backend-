const SuccessStory = require('../models/SuccessStory');

// @desc    Get all success stories
// @route   GET /api/stories
// @access  Public
const getAllStories = async (req, res) => {
    try {
        const { category, feeling, sort = 'newest', limit = 20 } = req.query;

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

        res.json({
            success: true,
            count: stories.length,
            data: stories
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

// @desc    Like a success story
// @route   POST /api/stories/:id/like
// @access  Public
const likeStory = async (req, res) => {
    try {
        const story = await SuccessStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });
        }

        story.likes += 1;
        await story.save();

        res.json({
            success: true,
            data: { likes: story.likes }
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
