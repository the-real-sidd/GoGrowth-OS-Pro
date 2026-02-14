const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Public routes - stats must come before :id or it will be treated as an ID
router.get('/stats', taskController.getStatistics);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);

// Routes - temporarily allow POST/PUT/DELETE without auth for development
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
