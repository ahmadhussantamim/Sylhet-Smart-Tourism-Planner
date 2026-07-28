const express = require('express');
const router = express.Router();
const c = require('../controllers/guideController');

router.get('/', c.getApprovedGuides);
router.get('/:id', c.getOne);

module.exports = router;
