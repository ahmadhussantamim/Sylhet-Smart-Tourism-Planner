const { pool } = require('../config/db');

function validateBooking({ trip_date, days }) {
  if (!trip_date || !days) return 'Trip date and number of days are required.';
  if (new Date(trip_date) < new Date(new Date().toDateString())) return 'Trip date cannot be in the past.';
  if (days < 1) return 'Days must be at least 1.';
  return null;
}

// ---------------- GUIDE BOOKINGS ----------------
exports.createGuideBooking = async (req, res) => {
  const error = validateBooking(req.body);
  if (error) return res.status(400).json({ message: error });
  const { guide_id, trip_date, days } = req.body;
  const [result] = await pool.query(
    'INSERT INTO guide_bookings (tourist_id, guide_id, trip_date, days) VALUES (?,?,?,?)',
    [req.user.userId, guide_id, trip_date, days]
  );
  res.status(201).json({ booking_id: result.insertId, message: 'Booking request sent.' });
};

exports.myGuideBookings = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT gb.*, u.name AS guide_name FROM guide_bookings gb
     JOIN guides g ON gb.guide_id = g.guide_id JOIN users u ON g.user_id = u.user_id
     WHERE gb.tourist_id = ? ORDER BY gb.created_at DESC`,
    [req.user.userId]
  );
  res.json(rows);
};

exports.guideRequests = async (req, res) => {
  const [[guide]] = await pool.query('SELECT guide_id FROM guides WHERE user_id = ?', [req.user.userId]);
  if (!guide) return res.status(404).json({ message: 'Guide profile not found.' });
  const [rows] = await pool.query(
    `SELECT gb.*, u.name AS tourist_name, u.phone AS tourist_phone FROM guide_bookings gb
     JOIN users u ON gb.tourist_id = u.user_id WHERE gb.guide_id = ? ORDER BY gb.created_at DESC`,
    [guide.guide_id]
  );
  res.json(rows);
};

exports.respondGuideBooking = async (req, res) => {
  const { status } = req.body; // 'Accepted' | 'Rejected' | 'Completed'
  await pool.query('UPDATE guide_bookings SET status = ? WHERE booking_id = ?', [status, req.params.id]);
  res.json({ message: `Booking ${status}.` });
};

// ---------------- VEHICLE BOOKINGS ----------------
exports.createVehicleBooking = async (req, res) => {
  const error = validateBooking(req.body);
  if (error) return res.status(400).json({ message: error });
  const { vehicle_id, trip_date, days } = req.body;
  const [result] = await pool.query(
    'INSERT INTO vehicle_bookings (tourist_id, vehicle_id, trip_date, days) VALUES (?,?,?,?)',
    [req.user.userId, vehicle_id, trip_date, days]
  );
  res.status(201).json({ booking_id: result.insertId, message: 'Booking request sent.' });
};

exports.myVehicleBookings = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT vb.*, v.vehicle_name FROM vehicle_bookings vb
     JOIN vehicles v ON vb.vehicle_id = v.vehicle_id
     WHERE vb.tourist_id = ? ORDER BY vb.created_at DESC`,
    [req.user.userId]
  );
  res.json(rows);
};

exports.vehicleRequests = async (req, res) => {
  const [[driver]] = await pool.query('SELECT driver_id FROM drivers WHERE user_id = ?', [req.user.userId]);
  if (!driver) return res.status(404).json({ message: 'Driver profile not found.' });
  const [rows] = await pool.query(
    `SELECT vb.*, v.vehicle_name, u.name AS tourist_name, u.phone AS tourist_phone
     FROM vehicle_bookings vb
     JOIN vehicles v ON vb.vehicle_id = v.vehicle_id
     JOIN users u ON vb.tourist_id = u.user_id
     WHERE v.driver_id = ? ORDER BY vb.created_at DESC`,
    [driver.driver_id]
  );
  res.json(rows);
};

exports.respondVehicleBooking = async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE vehicle_bookings SET status = ? WHERE booking_id = ?', [status, req.params.id]);
  res.json({ message: `Booking ${status}.` });
};
