const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const connectDB = db.connectDB || db.default?.connectDB;

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// Load environment variables
dotenv.config();

// Connect and sync database schemas with NeonDB
connectDB();

const app = express();

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  if (connectDB) {
    await connectDB();
  }
  next();
});

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads (payment receipts)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Root health check endpoint (responds to both /api/health and /health)
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    message: 'College Club Event API running on NeonDB (PostgreSQL)',
    databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
    env: process.env.NODE_ENV || 'production',
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
