const express = require('express');
const router = express.Router();
const c = require('../controllers/destinationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', c.getAll);
router.get('/:id', c.getOne);
router.post('/', protect, authorize('admin'), c.create);
router.put('/:id', protect, authorize('admin'), c.update);
router.delete('/:id', protect, authorize('admin'), c.remove);

module.exports = router;
