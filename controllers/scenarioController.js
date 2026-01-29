const Scenario = require('../models/Scenario');

// @desc    Get all scenarios
// @route   GET /api/scenarios
// @access  Public
const getAllScenarios = async (req, res) => {
    try {
        const { category, difficulty, limit = 20, page = 1 } = req.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        const scenarios = await Scenario.find(query)
            .populate('suggestedScripts')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Scenario.countDocuments(query);

        res.json({
            success: true,
            count: scenarios.length,
            total,
            pages: Math.ceil(total / parseInt(limit)),
            data: scenarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single scenario by ID
// @route   GET /api/scenarios/:id
// @access  Public
const getScenarioById = async (req, res) => {
    try {
        const scenario = await Scenario.findById(req.params.id)
            .populate('suggestedScripts');

        if (!scenario) {
            return res.status(404).json({
                success: false,
                message: 'Scenario not found'
            });
        }

        res.json({
            success: true,
            data: scenario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get scenarios by category
// @route   GET /api/scenarios/category/:category
// @access  Public
const getScenariosByCategory = async (req, res) => {
    try {
        const scenarios = await Scenario.find({ category: req.params.category })
            .populate('suggestedScripts')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: scenarios.length,
            data: scenarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Search scenarios
// @route   GET /api/scenarios/search
// @access  Public
const searchScenarios = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search query'
            });
        }

        const scenarios = await Scenario.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        }).populate('suggestedScripts');

        res.json({
            success: true,
            count: scenarios.length,
            data: scenarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all categories
// @route   GET /api/scenarios/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = [
            { id: 'billing', name: 'Billing Issues', icon: '💳', description: 'Overcharges, wrong bills, hidden fees' },
            { id: 'safety', name: 'Safety Concerns', icon: '⚠️', description: 'Unsafe conditions, rule violations' },
            { id: 'unfair-treatment', name: 'Unfair Treatment', icon: '⚖️', description: 'Queue jumping, rude behavior, discrimination' },
            { id: 'misinformation', name: 'Misinformation', icon: '📢', description: 'Wrong announcements, incorrect directions' },
            { id: 'service', name: 'Service Problems', icon: '🛎️', description: 'Poor service, unmet expectations' },
            { id: 'general', name: 'General Situations', icon: '💬', description: 'Other everyday situations' }
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
    getAllScenarios,
    getScenarioById,
    getScenariosByCategory,
    searchScenarios,
    getCategories
};
