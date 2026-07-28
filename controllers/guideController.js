const { pool } = require('../config/db');

// Public: only approved guides are shown to tourists
exports.getApprovedGuides = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT g.guide_id, g.experience, g.languages, g.description, g.daily_charge,
            g.profile_image, u.name, u.email, u.phone
     FROM guides g JOIN users u ON g.user_id = u.user_id
     WHERE g.status = 'approved'`
  );
  res.json(rows);
};

exports.getOne = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT g.*, u.name, u.email, u.phone FROM guides g
     JOIN users u ON g.user_id = u.user_id WHERE g.guide_id = ?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'Guide not found.' });
  res.json(rows[0]);
};
