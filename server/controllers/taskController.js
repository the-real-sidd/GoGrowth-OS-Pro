const GoogleSheetsService = require('../services/googleSheetsService');

let sheetsService;
let newlyCreatedTasks = []; // In-memory store for new tasks

const initSheetsService = () => {
  if (!sheetsService) {
    sheetsService = new GoogleSheetsService();
  }
  return sheetsService;
};

/**
 * GET /tasks
 */
exports.getAllTasks = async (req, res) => {
  try {
    const sheets = initSheetsService();
    let tasks = await sheets.getAllTasks();
    
    // Add newly created tasks from memory
    tasks = [...tasks, ...newlyCreatedTasks];

    const { status, assignedTo, client, sortBy } = req.query;

    if (status) tasks = tasks.filter(t => t.status === status);
    if (assignedTo) tasks = tasks.filter(t => t.assignedTo === assignedTo);
    if (client) tasks = tasks.filter(t => t.client === client);

    if (sortBy === 'deadline') {
      tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === 'priority') {
      const order = { Critical: 3, High: 2, Medium: 1, Low: 0 };
      tasks.sort((a, b) => order[b.priority] - order[a.priority]);
    } else {
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /tasks/:id
 */
exports.getTaskById = async (req, res) => {
  try {
    const sheets = initSheetsService();
    let task = await sheets.getTaskById(req.params.id);
    
    // Check memory store if not found in sheets
    if (!task) {
      task = newlyCreatedTasks.find(t => t._id === req.params.id);
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /tasks
 */
exports.createTask = async (req, res) => {
  try {
    console.log('Received task data:', JSON.stringify(req.body, null, 2));
    
    // Create task in memory (can be synced to Google Sheets later via OAuth2)
    const id = `task-${Date.now()}`;
    const newTask = {
      _id: id,
      task: req.body.task,
      description: req.body.description || '',
      assignedTo: req.body.assignedTo,
      status: req.body.status || 'Not Started',
      client: req.body.client,
      deadline: req.body.deadline,
      priority: req.body.priority || 'Medium',
      tags: req.body.tags || [],
      remarks: req.body.remarks || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    newlyCreatedTasks.push(newTask);
    console.log('Task created successfully:', newTask);
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /tasks/:id
 */
exports.updateTask = async (req, res) => {
  try {
    // Find task in memory store
    const taskIndex = newlyCreatedTasks.findIndex(t => t._id === req.params.id);
    
    if (taskIndex !== -1) {
      const updatedTask = {
        ...newlyCreatedTasks[taskIndex],
        task: req.body.task || newlyCreatedTasks[taskIndex].task,
        description: req.body.description || newlyCreatedTasks[taskIndex].description,
        assignedTo: req.body.assignedTo || newlyCreatedTasks[taskIndex].assignedTo,
        status: req.body.status || newlyCreatedTasks[taskIndex].status,
        client: req.body.client || newlyCreatedTasks[taskIndex].client,
        deadline: req.body.deadline || newlyCreatedTasks[taskIndex].deadline,
        priority: req.body.priority || newlyCreatedTasks[taskIndex].priority,
        tags: req.body.tags || newlyCreatedTasks[taskIndex].tags,
        remarks: req.body.remarks || newlyCreatedTasks[taskIndex].remarks,
        updatedAt: new Date().toISOString()
      };
      
      newlyCreatedTasks[taskIndex] = updatedTask;
      return res.json(updatedTask);
    }
    
    res.status(404).json({ message: 'Task not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const taskIndex = newlyCreatedTasks.findIndex(t => t._id === req.params.id);
    
    if (taskIndex !== -1) {
      newlyCreatedTasks.splice(taskIndex, 1);
      return res.json({ message: 'Task deleted successfully' });
    }
    
    res.status(404).json({ message: 'Task not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /tasks/statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const sheets = initSheetsService();
    let allTasks = await sheets.getAllTasks();
    allTasks = [...allTasks, ...newlyCreatedTasks];
    
    const stats = {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status === 'Completed').length,
      inProgress: allTasks.filter(t => t.status === 'In progress').length,
      pending: allTasks.filter(t => t.status === 'Pending' || t.status === 'Not Started').length
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
