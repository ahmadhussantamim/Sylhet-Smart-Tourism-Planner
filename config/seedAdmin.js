// config/seedAdmin.js
// -----------------------------------------------------------------------
// Run this ONCE with: npm run seed:admin
// It creates the first Admin account using the values from your .env
// file, with the password properly hashed (never store plain text
// passwords, even for a script you control).
// -----------------------------------------------------------------------

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function seedAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [ADMIN_EMAIL]
    );

    if (existing.length > 0) {
      console.log('⚠️  Admin already exists. Nothing to do.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [ADMIN_NAME, ADMIN_EMAIL, hashedPassword, 'admin']
    );

    console.log('✅ Admin account created!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
