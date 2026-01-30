const SuccessStory = require('../models/SuccessStory');
const Tip = require('../models/Tip');
const mongoose = require('mongoose');

// Helper to check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get platform statistics
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
    try {
        if (!isDbConnected()) {
            return res.json({
                success: true,
                data: {
                    totalStories: 0,
                    totalLikes: 0,
                    totalTips: 0,
                    empoweredPercentage: 0
                }
            });
        }

        // Get all stories and tips
        const stories = await SuccessStory.find({ isApproved: true });
        const tips = await Tip.find({ isApproved: true });

        // Calculate stats
        const totalStories = stories.length;
        const totalTips = tips.length;
        const totalLikes = stories.reduce((sum, story) => sum + (story.likes || 0), 0) +
                          tips.reduce((sum, tip) => sum + (tip.likes || 0), 0);

        const empoweredCount = stories.filter(story => 
            ['proud', 'empowered', 'confident'].includes(story.feeling)
        ).length;
        
        const empoweredPercentage = totalStories > 0 
            ? Math.round((empoweredCount / totalStories) * 100) 
            : 0;

        res.json({
            success: true,
            data: {
                totalStories,
                totalLikes,
                totalTips,
                empoweredPercentage
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getStats
};