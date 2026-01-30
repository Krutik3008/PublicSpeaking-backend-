const express = require('express');
const router = express.Router();
const {
    getAllScenarios,
    getScenarioById,
    getScenariosByCategory,
    searchScenarios,
    getCategories,
    createScenario
} = require('../controllers/scenarioController');

// Public routes
router.post('/', createScenario);
router.get('/', getAllScenarios);
router.get('/categories', getCategories);
router.get('/search', searchScenarios);
router.get('/category/:category', getScenariosByCategory);
router.get('/:id', getScenarioById);

module.exports = router;
