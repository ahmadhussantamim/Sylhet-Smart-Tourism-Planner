const express = require('express');
const router = express.Router();
const c = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', c.getAll);
router.get('/mine', protect, authorize('driver'), c.getMine);
router.post('/', protect, authorize('driver'), c.create);
router.put('/:id', protect, authorize('driver', 'admin'), c.update);
router.delete('/:id', protect, authorize('driver', 'admin'), c.remove);

module.exports = router;
