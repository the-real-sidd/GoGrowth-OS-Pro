const GoogleSheetsService = require('../services/googleSheetsService');

let sheetsService;

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
    const task = await sheets.getTaskById(req.params.id);

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
    const sheets = initSheetsService();
    const newTask = await sheets.createTask(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /tasks/:id
 */
exports.updateTask = async (req, res) => {
  try {
    const sheets = initSheetsService();
    const updated = await sheets.updateTask(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const sheets = initSheetsService();
    await sheets.deleteTask(req.params.id);
    res.json({ message: 'Task deleted' });
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
    const stats = await sheets.getStatistics();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
