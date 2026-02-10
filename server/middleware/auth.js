const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // In mock data mode, skip token verification
    if (process.env.USE_MOCK_DATA === 'true') {
      req.userId = '1'; // Mock user ID
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
