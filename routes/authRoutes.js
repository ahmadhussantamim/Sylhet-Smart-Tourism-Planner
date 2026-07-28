// routes/authRoutes.js
// -----------------------------------------------------------------------
// Routes only map "URL + HTTP method" -> controller function.
// No business logic lives here.
// -----------------------------------------------------------------------

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
