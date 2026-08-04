// server.js
// -----------------------------------------------------------------------
// The entry point of the backend. This file:
// 1. Loads environment variables
// 2. Sets up Express and middleware (CORS, JSON parsing)
// 3. Mounts route files under their base paths
// 4. Starts the server
// -----------------------------------------------------------------------

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const guideRoutes = require('./routes/guideRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ---- Global middleware ----
app.use(cors());            // allows the React frontend (different port) to call this API
app.use(express.json());    // lets us read JSON bodies as req.body

// ---- Health check route (useful to confirm the server is alive) ----
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Sylhet Tourism API is running' });
});

// ---- Feature routes ----
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/bookings', bookingRoutes);

// ---- 404 + error handling (must be LAST) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
