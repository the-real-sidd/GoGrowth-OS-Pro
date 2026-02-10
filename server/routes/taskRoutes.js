const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Public routes - stats must come before :id or it will be treated as an ID
router.get('/stats', taskController.getStatistics);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);

// Protected routes
router.post('/', auth, taskController.createTask);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
