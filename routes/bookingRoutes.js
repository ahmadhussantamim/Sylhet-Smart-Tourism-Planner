const express = require('express');
const router = express.Router();
const c = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Guide bookings
router.post('/guide', protect, authorize('tourist'), c.createGuideBooking);
router.get('/guide/mine', protect, authorize('tourist'), c.myGuideBookings);
router.get('/guide/requests', protect, authorize('guide'), c.guideRequests);
router.put('/guide/:id/status', protect, authorize('guide'), c.respondGuideBooking);

// Vehicle bookings
router.post('/vehicle', protect, authorize('tourist'), c.createVehicleBooking);
router.get('/vehicle/mine', protect, authorize('tourist'), c.myVehicleBookings);
router.get('/vehicle/requests', protect, authorize('driver'), c.vehicleRequests);
router.put('/vehicle/:id/status', protect, authorize('driver'), c.respondVehicleBooking);

module.exports = router;
