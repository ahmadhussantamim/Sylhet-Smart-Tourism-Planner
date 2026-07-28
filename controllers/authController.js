// controllers/authController.js
// -----------------------------------------------------------------------
// Controllers hold the actual business logic for a route. The route file
// just says "when this URL is hit, call this function" - the function
// itself lives here. This keeps routes.js short and readable.
// -----------------------------------------------------------------------

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Helper: creates a signed JWT containing the user's id and role.
// The frontend will store this token and send it back on every
// request that needs to know "who is logged in".
function generateToken(user) {
  return jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

// -----------------------------------------------------------------------
// POST /api/auth/register
// Registers a Tourist, Guide, or Driver. (Admins are created only via
// the seed script, not through public registration.)
// -----------------------------------------------------------------------
exports.register = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, email, password, phone, role, guideInfo, driverInfo } = req.body;

    // ---- Basic validation ----
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    }
    if (!['tourist', 'guide', 'driver'].includes(role)) {
      return res.status(400).json({ message: 'Role must be tourist, guide or driver.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // ---- Check for duplicate email ----
    const [existingUsers] = await connection.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // ---- Hash the password before saving ----
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, role]
    );
    const newUserId = userResult.insertId;

    // ---- Role-specific profile row ----
    if (role === 'guide') {
      const { experience, languages, description, dailyCharge } = guideInfo || {};
      if (!dailyCharge) {
        await connection.rollback();
        return res.status(400).json({ message: 'Guide daily charge is required.' });
      }
      await connection.query(
        `INSERT INTO guides (user_id, experience, languages, description, daily_charge)
         VALUES (?, ?, ?, ?, ?)`,
        [newUserId, experience || null, languages || null, description || null, dailyCharge]
      );
    }

    if (role === 'driver') {
      const { drivingLicense } = driverInfo || {};
      if (!drivingLicense) {
        await connection.rollback();
        return res.status(400).json({ message: 'Driving license number is required.' });
      }
      await connection.query(
        `INSERT INTO drivers (user_id, driving_license) VALUES (?, ?)`,
        [newUserId, drivingLicense]
      );
    }

    await connection.commit();

    const newUser = { user_id: newUserId, role };
    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: newUserId, name, email, role }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Server error during registration.' });
  } finally {
    connection.release();
  }
};

// -----------------------------------------------------------------------
// POST /api/auth/login
// Works for all four roles - the `role` is read from the database,
// not trusted from the request body.
// -----------------------------------------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // For guides/drivers, also tell the frontend their approval status
    // so the dashboard can show a "pending approval" message.
    let status = null;
    if (user.role === 'guide') {
      const [g] = await pool.query('SELECT status FROM guides WHERE user_id = ?', [user.user_id]);
      status = g[0]?.status || null;
    }
    if (user.role === 'driver') {
      const [d] = await pool.query('SELECT status FROM drivers WHERE user_id = ?', [user.user_id]);
      status = d[0]?.status || null;
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        status
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// -----------------------------------------------------------------------
// GET /api/auth/me
// Returns the currently logged-in user's basic info.
// Protected by the `protect` middleware (see middleware/authMiddleware.js)
// -----------------------------------------------------------------------
exports.getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, phone, role, created_at FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error('GetMe error:', error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};
