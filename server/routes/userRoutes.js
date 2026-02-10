const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getCurrentUser);
router.get('/', auth, userController.getAllUsers);
router.put('/:id', auth, userController.updateUser);

module.exports = router;
