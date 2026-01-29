const ConfidenceScript = require('../models/ConfidenceScript');
const User = require('../models/User');

// @desc    Get scripts for a scenario
// @route   GET /api/scripts/scenario/:scenarioId
// @access  Public
const getScriptsForScenario = async (req, res) => {
    try {
        const scripts = await ConfidenceScript.find({ scenario: req.params.scenarioId })
            .populate('scenario', 'title category');

        res.json({
            success: true,
            count: scripts.length,
            data: scripts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Generate quick script based on situation
// @route   POST /api/scripts/generate
// @access  Public
const generateQuickScript = async (req, res) => {
    try {
        const { situation, tone = 'calm' } = req.body;

        // Pre-built script templates based on tone
        const templates = {
            calm: {
                openingPrefix: "Excuse me, I noticed that",
                bodyPrefix: "I wanted to bring this to your attention because",
                closingLine: "I appreciate your understanding. Thank you for your help.",
                tips: [
                    "Take a deep breath before speaking",
                    "Speak slowly and clearly",
                    "Maintain friendly eye contact"
                ],
                bodyLanguageTips: [
                    "Keep your hands relaxed at your sides",
                    "Stand with open posture",
                    "Nod occasionally to show you're engaged"
                ],
                doNot: [
                    "Don't raise your voice",
                    "Don't point fingers",
                    "Don't make it personal"
                ]
            },
            assertive: {
                openingPrefix: "I need to address something important:",
                bodyPrefix: "This needs attention because",
                closingLine: "I expect this to be resolved. What are the next steps?",
                tips: [
                    "Be direct and clear",
                    "State facts, not emotions",
                    "Ask for specific actions"
                ],
                bodyLanguageTips: [
                    "Stand tall and confident",
                    "Make direct eye contact",
                    "Use measured hand gestures"
                ],
                doNot: [
                    "Don't be aggressive",
                    "Don't interrupt",
                    "Don't make threats"
                ]
            },
            friendly: {
                openingPrefix: "Hi! I hope you can help me with something -",
                bodyPrefix: "I think there might be a small issue here:",
                closingLine: "Thanks so much for looking into this! I really appreciate it.",
                tips: [
                    "Smile genuinely",
                    "Use a warm tone",
                    "Acknowledge their effort"
                ],
                bodyLanguageTips: [
                    "Lean in slightly to show interest",
                    "Use open, welcoming gestures",
                    "Mirror their positive expressions"
                ],
                doNot: [
                    "Don't be sarcastic",
                    "Don't minimize the issue",
                    "Don't be overly apologetic"
                ]
            },
            firm: {
                openingPrefix: "I need to bring an important matter to your attention:",
                bodyPrefix: "This situation requires immediate attention because",
                closingLine: "I need this to be addressed now. Who can help me with this?",
                tips: [
                    "Be clear about your expectations",
                    "Don't back down on valid concerns",
                    "Stay professional throughout"
                ],
                bodyLanguageTips: [
                    "Maintain steady eye contact",
                    "Keep your posture strong but not aggressive",
                    "Speak with a steady, controlled voice"
                ],
                doNot: [
                    "Don't lose your temper",
                    "Don't make ultimatums",
                    "Don't get personal"
                ]
            }
        };

        const template = templates[tone] || templates.calm;

        // Generate a script based on the situation
        const generatedScript = {
            situation: situation,
            tone: tone,
            openingLine: `${template.openingPrefix} ${situation.toLowerCase().includes('i') ? situation : situation.toLowerCase()}.`,
            bodyScript: `${template.bodyPrefix} it affects the quality of service/experience. I believe addressing this would benefit everyone involved.`,
            closingLine: template.closingLine,
            tips: template.tips,
            bodyLanguageTips: template.bodyLanguageTips,
            doNot: template.doNot,
            fullScript: `${template.openingPrefix} ${situation.toLowerCase()}. ${template.bodyPrefix} it affects the quality of service/experience. ${template.closingLine}`,
            quickReminders: [
                "🧘 Take a breath first",
                "👀 Make friendly eye contact",
                "🗣️ Speak slowly and clearly",
                "🤝 Stay respectful throughout"
            ]
        };

        res.json({
            success: true,
            data: generatedScript
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Save a script to user's favorites
// @route   POST /api/scripts/save/:scriptId
// @access  Private
const saveScript = async (req, res) => {
    try {
        const script = await ConfidenceScript.findById(req.params.scriptId);

        if (!script) {
            return res.status(404).json({
                success: false,
                message: 'Script not found'
            });
        }

        const user = await User.findById(req.user._id);

        // Check if already saved
        if (user.savedScripts.includes(req.params.scriptId)) {
            return res.status(400).json({
                success: false,
                message: 'Script already saved'
            });
        }

        user.savedScripts.push(req.params.scriptId);
        await user.save();

        res.json({
            success: true,
            message: 'Script saved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove a script from user's favorites
// @route   DELETE /api/scripts/save/:scriptId
// @access  Private
const unsaveScript = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.savedScripts = user.savedScripts.filter(
            (id) => id.toString() !== req.params.scriptId
        );
        await user.save();

        res.json({
            success: true,
            message: 'Script removed from saved'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's saved scripts
// @route   GET /api/scripts/saved
// @access  Private
const getSavedScripts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedScripts',
            populate: { path: 'scenario', select: 'title category' }
        });

        res.json({
            success: true,
            count: user.savedScripts.length,
            data: user.savedScripts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all scripts
// @route   GET /api/scripts
// @access  Public
const getAllScripts = async (req, res) => {
    try {
        const { tone, limit = 20 } = req.query;

        let query = {};
        if (tone) {
            query.tone = tone;
        }

        const scripts = await ConfidenceScript.find(query)
            .populate('scenario', 'title category')
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: scripts.length,
            data: scripts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getScriptsForScenario,
    generateQuickScript,
    saveScript,
    unsaveScript,
    getSavedScripts,
    getAllScripts
};
