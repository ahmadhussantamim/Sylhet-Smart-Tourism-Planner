const { pool } = require('../config/db');

exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT v.*, u.name AS driver_name, d.status AS driver_status FROM vehicles v
     JOIN drivers d ON v.driver_id = d.driver_id
     JOIN users u ON d.user_id = u.user_id
     WHERE d.status = 'approved'`
  );
  res.json(rows);
};

exports.getMine = async (req, res) => {
  const [[driver]] = await pool.query('SELECT driver_id FROM drivers WHERE user_id = ?', [req.user.userId]);
  if (!driver) return res.status(404).json({ message: 'Driver profile not found.' });
  const [rows] = await pool.query('SELECT * FROM vehicles WHERE driver_id = ?', [driver.driver_id]);
  res.json(rows);
};

exports.create = async (req, res) => {
  const { vehicle_name, vehicle_type, passenger_capacity, price_per_day, vehicle_image } = req.body;
  const [[driver]] = await pool.query('SELECT driver_id FROM drivers WHERE user_id = ?', [req.user.userId]);
  if (!driver) return res.status(404).json({ message: 'Driver profile not found.' });
  const [result] = await pool.query(
    'INSERT INTO vehicles (driver_id, vehicle_name, vehicle_type, passenger_capacity, price_per_day, vehicle_image) VALUES (?,?,?,?,?,?)',
    [driver.driver_id, vehicle_name, vehicle_type, passenger_capacity, price_per_day, vehicle_image || null]
  );
  res.status(201).json({ vehicle_id: result.insertId });
};

exports.update = async (req, res) => {
  const { vehicle_name, vehicle_type, passenger_capacity, price_per_day, vehicle_image } = req.body;
  await pool.query(
    'UPDATE vehicles SET vehicle_name=?, vehicle_type=?, passenger_capacity=?, price_per_day=?, vehicle_image=? WHERE vehicle_id=?',
    [vehicle_name, vehicle_type, passenger_capacity, price_per_day, vehicle_image, req.params.id]
  );
  res.json({ message: 'Vehicle updated.' });
};

exports.remove = async (req, res) => {
  await pool.query('DELETE FROM vehicles WHERE vehicle_id = ?', [req.params.id]);
  res.json({ message: 'Vehicle deleted.' });
};
