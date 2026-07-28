// config/db.js
// -----------------------------------------------------------------------
// Creates one shared MySQL connection pool for the whole backend.
// A "pool" is a set of ready-to-use connections that Express borrows from
// whenever a request needs the database, instead of opening a brand new
// connection every time (which would be slow).
// -----------------------------------------------------------------------

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Quick test used by server.js on startup so we fail loudly and early
// if MySQL credentials are wrong, instead of failing later on a request.
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
