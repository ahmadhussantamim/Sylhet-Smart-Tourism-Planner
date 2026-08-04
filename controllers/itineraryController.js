const { pool } = require('../config/db');

// Simple rule-based planner: match destinations to chosen interests,
// then assign one per day (cycling through matches if the trip is
// longer than the number of matching places).
exports.generate = async (req, res) => {
  const { budget, numDays, interests } = req.body;

  if (!budget || !numDays || !interests || !interests.length) {
    return res.status(400).json({ message: 'Budget, number of days and at least one interest are required.' });
  }
  if (numDays < 1 || numDays > 14) {
    return res.status(400).json({ message: 'Number of days must be between 1 and 14.' });
  }

  const placeholders = interests.map(() => '?').join(',');
  let [matches] = await pool.query(
    `SELECT * FROM destinations WHERE category IN (${placeholders}) ORDER BY entry_fee ASC`,
    interests
  );
  if (matches.length === 0) {
    [matches] = await pool.query('SELECT * FROM destinations ORDER BY entry_fee ASC');
  }
  if (matches.length === 0) {
    return res.status(404).json({ message: 'No destinations available yet.' });
  }

  let totalCost = 0;
  const plan = [];
  for (let day = 1; day <= numDays; day++) {
    const place = matches[(day - 1) % matches.length];
    totalCost += Number(place.entry_fee);
    plan.push({ day, destination_id: place.destination_id, name: place.name, category: place.category, entry_fee: place.entry_fee });
  }

  const result = { plan, totalCost, budget, withinBudget: totalCost <= budget };

  // Save it so the tourist can revisit it from "My Trips"
  await pool.query(
    'INSERT INTO itineraries (user_id, budget, num_days, interests, plan_json) VALUES (?,?,?,?,?)',
    [req.user.userId, budget, numDays, interests.join(','), JSON.stringify(result)]
  );

  res.status(201).json(result);
};

exports.getMine = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM itineraries WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId]
  );
  const parsed = rows.map((r) => ({ ...r, plan_json: JSON.parse(r.plan_json) }));
  res.json(parsed);
};
