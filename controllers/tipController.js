const Tip = require('../models/Tip');
const { tips: fallbackTips } = require('../utils/fallbackData');
const mongoose = require('mongoose');

// Helper to check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all tips with user like status
// @route   GET /api/tips
// @access  Public
const getAllTips = async (req, res) => {
    try {
        const { category, sort = 'likes', limit = 50 } = req.query;
        const userId = req.user?._id;

        if (!isDbConnected()) {
            let filteredTips = fallbackTips.filter(tip => tip.isApproved);
            
            if (category) {
                filteredTips = filteredTips.filter(tip => tip.category === category);
            }
            
            // Add hasLiked status for fallback
            if (userId) {
                const userLikes = fallbackTipLikes.get(userId) || new Set();
                filteredTips = filteredTips.map(tip => ({
                    ...tip,
                    hasLiked: userLikes.has(tip._id)
                }));
            }
            
            // Sort tips
            if (sort === 'likes') {
                filteredTips.sort((a, b) => b.likes - a.likes);
            } else if (sort === 'newest') {
                filteredTips.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            }
            
            const limitedTips = filteredTips.slice(0, parseInt(limit));
            
            return res.json({
                success: true,
                count: limitedTips.length,
                data: limitedTips
            });
        }

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

        // Add hasLiked status for each tip
        const tipsWithLikeStatus = tips.map(tip => ({
            ...tip.toObject(),
            hasLiked: userId ? tip.likedBy.includes(userId) : false
        }));

        res.json({
            success: true,
            count: tipsWithLikeStatus.length,
            data: tipsWithLikeStatus
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

// In-memory like tracking for fallback
let fallbackTipLikes = new Map();

// Clear all likes on server restart
fallbackTipLikes.clear();

// Reset fallback data likes to 0
const fallbackData = require('../utils/fallbackData');
fallbackData.tips.forEach(tip => {
    tip.likes = 0;
    tip.likedBy = [];
});

// @desc    Like/Unlike a tip
// @route   POST /api/tips/:id/like
// @access  Private
const likeTip = async (req, res) => {
    try {
        const userId = req.user._id;
        const tipId = req.params.id;

        if (!isDbConnected()) {
            // Fallback like system
            const userLikes = fallbackTipLikes.get(userId) || new Set();
            const tip = fallbackTips.find(t => t._id === tipId);
            
            if (!tip) {
                return res.status(404).json({
                    success: false,
                    message: 'Tip not found'
                });
            }

            const hasLiked = userLikes.has(tipId);
            
            if (hasLiked) {
                userLikes.delete(tipId);
                tip.likes = Math.max(0, tip.likes - 1);
            } else {
                userLikes.add(tipId);
                tip.likes += 1;
            }
            
            fallbackTipLikes.set(userId, userLikes);
            
            return res.json({
                success: true,
                data: { 
                    likes: tip.likes, 
                    hasLiked: !hasLiked,
                    action: hasLiked ? 'unliked' : 'liked'
                }
            });
        }

        const tip = await Tip.findById(tipId);
        if (!tip) {
            return res.status(404).json({
                success: false,
                message: 'Tip not found'
            });
        }

        // Check if user already liked this tip
        const hasLiked = tip.likedBy.includes(userId);
        
        if (hasLiked) {
            // Unlike: remove user from likedBy array and decrease likes
            tip.likedBy = tip.likedBy.filter(id => id.toString() !== userId.toString());
            tip.likes = Math.max(0, tip.likes - 1);
        } else {
            // Like: add user to likedBy array and increase likes
            tip.likedBy.push(userId);
            tip.likes += 1;
        }

        await tip.save();

        res.json({
            success: true,
            data: { 
                likes: tip.likes, 
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
