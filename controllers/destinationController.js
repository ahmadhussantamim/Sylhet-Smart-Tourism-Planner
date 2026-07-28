const { pool } = require('../config/db');

exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM destinations ORDER BY destination_id DESC');
  res.json(rows);
};

exports.getOne = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM destinations WHERE destination_id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Destination not found.' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const { name, category, description, image, entry_fee } = req.body;
  if (!name || !category) return res.status(400).json({ message: 'Name and category are required.' });
  const [result] = await pool.query(
    'INSERT INTO destinations (name, category, description, image, entry_fee) VALUES (?,?,?,?,?)',
    [name, category, description || null, image || null, entry_fee || 0]
  );
  res.status(201).json({ destination_id: result.insertId, ...req.body });
};

exports.update = async (req, res) => {
  const { name, category, description, image, entry_fee } = req.body;
  await pool.query(
    'UPDATE destinations SET name=?, category=?, description=?, image=?, entry_fee=? WHERE destination_id=?',
    [name, category, description, image, entry_fee, req.params.id]
  );
  res.json({ message: 'Destination updated.' });
};

exports.remove = async (req, res) => {
  await pool.query('DELETE FROM destinations WHERE destination_id = ?', [req.params.id]);
  res.json({ message: 'Destination deleted.' });
};
