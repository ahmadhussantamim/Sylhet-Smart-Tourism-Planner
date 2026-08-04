const express = require('express');
const router = express.Router();
const c = require('../controllers/itineraryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/generate', protect, authorize('tourist'), c.generate);
router.get('/mine', protect, authorize('tourist'), c.getMine);

module.exports = router;
