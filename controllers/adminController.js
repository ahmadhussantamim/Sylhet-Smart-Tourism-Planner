const { pool } = require('../config/db');

exports.getStats = async (req, res) => {
  const [[{ tourists }]] = await pool.query("SELECT COUNT(*) tourists FROM users WHERE role='tourist'");
  const [[{ guides }]] = await pool.query('SELECT COUNT(*) guides FROM guides');
  const [[{ drivers }]] = await pool.query('SELECT COUNT(*) drivers FROM drivers');
  const [[{ vehicles }]] = await pool.query('SELECT COUNT(*) vehicles FROM vehicles');
  const [[{ guideBookings }]] = await pool.query('SELECT COUNT(*) guideBookings FROM guide_bookings');
  const [[{ vehicleBookings }]] = await pool.query('SELECT COUNT(*) vehicleBookings FROM vehicle_bookings');
  res.json({ tourists, guides, drivers, vehicles, bookings: guideBookings + vehicleBookings });
};

exports.getUsersByRole = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT user_id, name, email, phone, created_at FROM users WHERE role = ?',
    [req.params.role]
  );
  res.json(rows);
};

exports.getAllGuides = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT g.*, u.name, u.email, u.phone FROM guides g JOIN users u ON g.user_id = u.user_id`
  );
  res.json(rows);
};

exports.setGuideStatus = async (req, res) => {
  const { status } = req.body; // 'approved' | 'rejected'
  await pool.query('UPDATE guides SET status = ? WHERE guide_id = ?', [status, req.params.id]);
  res.json({ message: `Guide ${status}.` });
};

exports.getAllDrivers = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT d.*, u.name, u.email, u.phone FROM drivers d JOIN users u ON d.user_id = u.user_id`
  );
  res.json(rows);
};

exports.setDriverStatus = async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE drivers SET status = ? WHERE driver_id = ?', [status, req.params.id]);
  res.json({ message: `Driver ${status}.` });
};
