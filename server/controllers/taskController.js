const Task = require('../models/Task');
const GoogleSheetsService = require('../services/googleSheetsService');
const { mockTasks } = require('../mockData');

let sheetsService;

// Initialize Google Sheets service if credentials are available
const initSheetsService = () => {
  if (
    !sheetsService &&
    process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_API_KEY
  ) {
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

    if (sheets) {
      const tasks = await sheets.getAllTasks(req.query);
      return res.json(tasks);
    }

    if (process.env.USE_MOCK_DATA === 'true') {
      const { status, assignedTo, client, sortBy } = req.query;
      let tasks = [...mockTasks];

      if (status) tasks = tasks.filter(t => t.status === status);
      if (assignedTo) tasks = tasks.filter(t => t.assignedTo === assignedTo);
      if (client) tasks = tasks.filter(t => t.client === client);

      if (sortBy === 'deadline') {
        tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      } else if (sortBy === 'priority') {
        const priorityOrder = { Critical: 3, High: 2, Medium: 1, Low: 0 };
        tasks.sort(
          (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
        );
      } else {
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json(tasks);
    }

    const { status, assignedTo, client, sortBy } = req.query;
    const query = {};

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (client) query.client = client;

    let tasksQuery = Task.find(query);

    if (sortBy === 'deadline') {
      tasksQuery = tasksQuery.sort({ deadline: 1 });
    } else if (sortBy === 'priority') {
      tasksQuery = tasksQuery.sort({ priority: -1 });
    } else {
      tasksQuery = tasksQuery.sort({ createdAt: -1 });
    }

    const tasks = await tasksQuery;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /tasks/:id
 */
exports.getTaskById = async (req, res) => {
  try {
    const sheets = initSheetsService();

    if (sheets) {
      const task = await sheets.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json(task);
    }

    if (process.env.USE_MOCK_DATA === 'true') {
      const task = mockTasks.find(t => t._id === req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json(task);
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /tasks
 */
exports.createTask = async (req, res) => {
  try {
    const sheets = initSheetsService();

    if (sheets) {
      const newTask = await sheets.createTask(req.body);
      return res.status(201).json(newTask);
    }

    if (process.env.USE_MOCK_DATA === 'true') {
      const newTask = {
        _id: String(Date.now()),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTasks.push(newTask);
      return res.status(201).json(newTask);
    }

    const task = new Task(req.body);
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /tasks/:id
 */
exports.updateTask = async (req, res) => {
  try {
    const sheets = initSheetsService();

    if (sheets) {
      const updatedTask = await sheets.updateTask(req.params.id, req.body);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json(updatedTask);
    }

    if (process.env.USE_MOCK_DATA === 'true') {
      const index = mockTasks.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }

      mockTasks[index] = {
        ...mockTasks[index],
        ...req.body,
        updatedAt: new Date(),
      };

      return res.json(mockTasks[index]);
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body);
    task.updatedAt = Date.now();

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const sheets = initSheetsService();

    if (sheets) {
      await sheets.deleteTask(req.params.id);
      return res.json({ message: 'Task deleted' });
    }

    if (process.env.USE_MOCK_DATA === 'true') {
      const index = mockTasks.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }

      mockTasks.splice(index, 1);
      return res.json({ message: 'Task deleted' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /tasks/statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const sheets = initSheetsService();

    if (sheets) {
      const stats = await sheets.getStatistics();
      return res.json(stats);
    }

    if (process.env.USE_MOCK_DATA === 'true') {
      const total = mockTasks.length;
      const completed = mockTasks.filter(t => t.status === 'Completed').length;
      const inProgress = mockTasks.filter(
        t => t.status === 'In progress'
      ).length;
      const pending = mockTasks.filter(t => t.status === 'Pending').length;

      return res.json({ total, completed, inProgress, pending });
    }

    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: 'Completed' });
    const inProgress = await Task.countDocuments({ status: 'In progress' });
    const pending = await Task.countDocuments({ status: 'Pending' });

    res.json({ total, completed, inProgress, pending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};