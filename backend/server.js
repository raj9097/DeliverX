require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import configuration and utilities
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');
const { HTTP_STATUS } = require('./config/constants');

// Import Routes
const shipmentRoutes = require('./routes/shipmentRoutes');
const driverRoutes = require('./routes/driverRoutes');
const statRoutes = require('./routes/statRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/shipments', shipmentRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Handle preflight requests
app.options('*', cors());

// 404 handler
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: 'Route not found',
    path: req.path,
    success: false,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  res.status(HTTP_STATUS.SERVER_ERROR).json({
    statusCode: HTTP_STATUS.SERVER_ERROR,
    message: err.message || 'Internal server error',
    success: false,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      logger.success(`Server running on port ${PORT}`);
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info(`API Base URL: http://localhost:${PORT}/api`);
      
      if (NODE_ENV === 'development') {
        logger.info('Frontend: http://localhost:5173');
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  logger.error('Reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.warn('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;

