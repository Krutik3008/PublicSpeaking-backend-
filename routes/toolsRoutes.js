const express = require('express');
const router = express.Router();
const {
    getPhrases,
    getAffirmations,
    getPracticeScripts
} = require('../controllers/toolsController');

router.get('/phrases', getPhrases);
router.get('/affirmations', getAffirmations);
router.get('/scripts', getPracticeScripts);

module.exports = router;
