const Phrase = require('../models/Phrase');
const Affirmation = require('../models/Affirmation');
const PracticeScript = require('../models/PracticeScript');

// @desc    Get all quick phrases
// @route   GET /api/tools/phrases
// @access  Public
const getPhrases = async (req, res) => {
    try {
        const phrases = await Phrase.find().sort({ category: 1 });
        res.status(200).json({ success: true, count: phrases.length, data: phrases });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all affirmations
// @route   GET /api/tools/affirmations
// @access  Public
const getAffirmations = async (req, res) => {
    try {
        const affirmations = await Affirmation.find();
        res.status(200).json({ success: true, count: affirmations.length, data: affirmations });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all practice scripts
// @route   GET /api/tools/scripts
// @access  Public
const getPracticeScripts = async (req, res) => {
    try {
        const scripts = await PracticeScript.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: scripts.length, data: scripts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

module.exports = {
    getPhrases,
    getAffirmations,
    getPracticeScripts
};
