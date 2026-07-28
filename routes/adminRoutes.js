const express = require('express');
const router = express.Router();
const c = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin')); // every route below requires admin

router.get('/stats', c.getStats);
router.get('/users/:role', c.getUsersByRole);
router.get('/guides', c.getAllGuides);
router.put('/guides/:id/status', c.setGuideStatus);
router.get('/drivers', c.getAllDrivers);
router.put('/drivers/:id/status', c.setDriverStatus);

module.exports = router;
