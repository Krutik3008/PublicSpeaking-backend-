const express = require('express');
const router = express.Router();
const {
    getScriptsForScenario,
    generateQuickScript,
    saveScript,
    unsaveScript,
    getSavedScripts,
    getAllScripts
} = require('../controllers/scriptController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, quickScriptValidation } = require('../middlewares/validateMiddleware');

// Public routes
router.get('/', getAllScripts);
router.get('/scenario/:scenarioId', getScriptsForScenario);
router.post('/generate', quickScriptValidation, validate, generateQuickScript);

// Protected routes
router.get('/saved', protect, getSavedScripts);
router.post('/save/:scriptId', protect, saveScript);
router.delete('/save/:scriptId', protect, unsaveScript);

module.exports = router;
