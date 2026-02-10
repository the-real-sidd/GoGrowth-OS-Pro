const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
  try {
    // If using mock data, return mock response
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockUser = {
        _id: '1',
        name: req.body.name || 'Demo User',
        email: req.body.email || 'demo@gogrowth.com',
        role: 'admin'
      };
      const token = jwt.sign({ userId: mockUser._id }, process.env.JWT_SECRET || 'secret');
      return res.status(201).json({ user: mockUser, token });
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    // If using mock data, return mock response
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockUser = {
        _id: '1',
        name: 'Demo User',
        email: 'demo@gogrowth.com',
        role: 'admin'
      };
      const token = jwt.sign({ userId: mockUser._id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h'
      });
      return res.json({ user: mockUser, token });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '24h'
    });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    // If using mock data, return mock response
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockUser = {
        _id: '1',
        name: 'Demo User',
        email: 'demo@gogrowth.com',
        role: 'admin'
      };
      return res.json(mockUser);
    }

    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // If using mock data, return mock response
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockUsers = [
        { _id: '1', name: 'Demo User', email: 'demo@gogrowth.com', role: 'admin' }
      ];
      return res.json(mockUsers);
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // If using mock data, return mock response
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockUser = { _id: req.params.id, ...req.body, role: 'admin' };
      return res.json(mockUser);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

