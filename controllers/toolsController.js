const Phrase = require('../models/Phrase');
const Affirmation = require('../models/Affirmation');
const PracticeScript = require('../models/PracticeScript');
const { phrases: fallbackPhrases, affirmations: fallbackAffirmations, scripts: fallbackScripts } = require('../utils/fallbackData');
const mongoose = require('mongoose');

// Helper to check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all quick phrases
// @route   GET /api/tools/phrases
// @access  Public
const getPhrases = async (req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(200).json({ 
                success: true, 
                count: fallbackPhrases.length, 
                data: fallbackPhrases 
            });
        }
        
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
        if (!isDbConnected()) {
            return res.status(200).json({ 
                success: true, 
                count: fallbackAffirmations.length, 
                data: fallbackAffirmations 
            });
        }
        
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
        if (!isDbConnected()) {
            return res.status(200).json({ 
                success: true, 
                count: fallbackScripts.length, 
                data: fallbackScripts 
            });
        }
        
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
