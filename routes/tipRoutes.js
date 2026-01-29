const express = require('express');
const router = express.Router();
const {
    getAllTips,
    getTipsByCategory,
    addTip,
    likeTip,
    getTipCategories
} = require('../controllers/tipController');
const { validate, tipValidation } = require('../middlewares/validateMiddleware');

// Public routes (all tips are anonymous)
router.get('/', getAllTips);
router.get('/categories', getTipCategories);
router.get('/category/:category', getTipsByCategory);
router.post('/', tipValidation, validate, addTip);
router.post('/:id/like', likeTip);

module.exports = router;
