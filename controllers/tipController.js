const Tip = require('../models/Tip');

// @desc    Get all tips
// @route   GET /api/tips
// @access  Public
const getAllTips = async (req, res) => {
    try {
        const { category, sort = 'likes', limit = 50 } = req.query;

        let query = { isApproved: true };

        if (category) {
            query.category = category;
        }

        let sortOption = {};
        if (sort === 'likes') {
            sortOption = { likes: -1 };
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        }

        const tips = await Tip.find(query)
            .sort(sortOption)
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: tips.length,
            data: tips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get tips by category
// @route   GET /api/tips/category/:category
// @access  Public
const getTipsByCategory = async (req, res) => {
    try {
        const tips = await Tip.find({
            category: req.params.category,
            isApproved: true
        }).sort({ likes: -1 });

        res.json({
            success: true,
            count: tips.length,
            data: tips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add a new tip (anonymous)
// @route   POST /api/tips
// @access  Public
const addTip = async (req, res) => {
    try {
        const { category, content } = req.body;

        const tip = await Tip.create({
            category,
            content,
            isAnonymous: true,
            isApproved: true // Auto-approve for now, can add moderation later
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for sharing your wisdom!',
            data: tip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Like a tip
// @route   POST /api/tips/:id/like
// @access  Public
const likeTip = async (req, res) => {
    try {
        const tip = await Tip.findById(req.params.id);

        if (!tip) {
            return res.status(404).json({
                success: false,
                message: 'Tip not found'
            });
        }

        tip.likes += 1;
        await tip.save();

        res.json({
            success: true,
            data: { likes: tip.likes }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get tip categories
// @route   GET /api/tips/categories
// @access  Public
const getTipCategories = async (req, res) => {
    try {
        const categories = [
            { id: 'general', name: 'General Tips', icon: '💡' },
            { id: 'body-language', name: 'Body Language', icon: '🧍' },
            { id: 'tone', name: 'Tone & Voice', icon: '🗣️' },
            { id: 'timing', name: 'Timing', icon: '⏰' },
            { id: 'mindset', name: 'Mindset', icon: '🧠' },
            { id: 'preparation', name: 'Preparation', icon: '📝' }
        ];

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllTips,
    getTipsByCategory,
    addTip,
    likeTip,
    getTipCategories
};
