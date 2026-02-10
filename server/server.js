const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Initialize global app data store
global.appData = {
  users: [
    {
      _id: 'user-1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01')
    }
  ]
};

// Middleware
app.use(cors());
app.use(express.json());


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
