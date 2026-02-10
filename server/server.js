const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable mock data mode by default if MongoDB not available
if (!process.env.USE_MOCK_DATA && !process.env.MONGODB_URI) {
  process.env.USE_MOCK_DATA = 'true';
  console.log('ℹ Mock data mode enabled (MongoDB not configured)');
}

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (optional if using mock data)
if (process.env.USE_MOCK_DATA !== 'true') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gogrowth', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
    .then(() => console.log('✓ MongoDB connected'))
    .catch(err => {
      console.warn('⚠ MongoDB connection failed, using mock data mode');
      process.env.USE_MOCK_DATA = 'true';
    });
} else {
  console.log('✓ Using mock data mode');
}

// Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
