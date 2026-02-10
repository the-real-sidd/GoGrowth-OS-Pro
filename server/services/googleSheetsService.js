const { google } = require('googleapis');

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.tasksSheetName = process.env.TASKS_SHEET_NAME || 'All';
    this.resourcesSheetName = process.env.RESOURCES_SHEET_NAME || 'Resources';
    this.sheets = google.sheets({
      version: 'v4',
      auth: this.apiKey
    });
  }

  // Fetch all tasks from Tasks sheet
  async getAllTasks(filters = {}) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.tasksSheetName}!A2:L`,
      });

      const rows = response.data.values || [];
      const tasks = this.parseTasksFromSheet(rows);

      // Apply filters
      let filtered = tasks;
      if (filters.status) {
        filtered = filtered.filter(t => t.status === filters.status);
      }
      if (filters.assignedTo) {
        filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
      }
      if (filters.client) {
        filtered = filtered.filter(t => t.client === filters.client);
      }

      return filtered;
    } catch (error) {
      console.error('Error fetching tasks from Google Sheets:', error);
      throw new Error('Failed to fetch tasks from Google Sheets');
    }
  }

  // Fetch all resources from Resources sheet
  async getAllResources(filters = {}) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.resourcesSheetName}!A2:G`,
      });

      const rows = response.data.values || [];
      const resources = this.parseResourcesFromSheet(rows);

      // Apply filters
      let filtered = resources;
      if (filters.category) {
        filtered = filtered.filter(r => r.category === filters.category);
      }
      if (filters.type) {
        filtered = filtered.filter(r => r.type === filters.type);
      }
      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }

      return filtered;
    } catch (error) {
      console.error('Error fetching resources from Google Sheets:', error);
      throw new Error('Failed to fetch resources from Google Sheets');
    }
  }

  // Get task by ID
  async getTaskById(id) {
    try {
      const tasks = await this.getAllTasks();
      return tasks.find(t => t._id === id);
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // Get resource by ID
  async getResourceById(id) {
    try {
      const resources = await this.getAllResources();
      return resources.find(r => r._id === id);
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  }

  // Create task
  async createTask(taskData) {
    try {
      const id = `task-${Date.now()}`;
      const values = [
        [
          id, // ID
          taskData.title,
          taskData.description,
          taskData.priority,
          taskData.status,
          taskData.assignedTo,
          taskData.client,
          taskData.deadline,
          taskData.tags ? taskData.tags.join(', ') : '',
          new Date().toISOString(),
          new Date().toISOString(),
          '' // Empty column for safety
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.tasksSheetName}!A:L`,
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return { _id: id, ...taskData, createdAt: new Date(), updatedAt: new Date() };
    } catch (error) {
      console.error('Error creating task in Google Sheets:', error);
      throw new Error('Failed to create task');
    }
  }

  // Create resource
  async createResource(resourceData) {
    try {
      const id = `resource-${Date.now()}`;
      const values = [
        [
          id,
          resourceData.title,
          resourceData.description,
          resourceData.category,
          resourceData.type,
          resourceData.url,
          resourceData.status,
          resourceData.tags ? resourceData.tags.join(', ') : ''
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.resourcesSheetName}!A:H`,
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      });

      return { _id: id, ...resourceData, createdAt: new Date(), updatedAt: new Date() };
    } catch (error) {
      console.error('Error creating resource in Google Sheets:', error);
      throw new Error('Failed to create resource');
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const tasks = await this.getAllTasks();
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'Completed').length;
      const inProgress = tasks.filter(t => t.status === 'In progress').length;
      const pending = tasks.filter(t => t.status === 'Pending').length;

      return { total, completed, inProgress, pending };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  // Parse tasks from sheet rows
  parseTasksFromSheet(rows) {
    return rows.map((row, index) => ({
      _id: row[0] || `task-${index}`,
      title: row[1] || '',
      description: row[2] || '',
      priority: row[3] || 'Medium',
      status: row[4] || 'Pending',
      assignedTo: row[5] || 'Unassigned',
      client: row[6] || '',
      deadline: row[7] || '',
      tags: row[8] ? row[8].split(',').map(t => t.trim()) : [],
      createdAt: row[9] ? new Date(row[9]) : new Date(),
      updatedAt: row[10] ? new Date(row[10]) : new Date()
    }));
  }

  // Parse resources from sheet rows
  parseResourcesFromSheet(rows) {
    return rows.map((row, index) => ({
      _id: row[0] || `resource-${index}`,
      title: row[1] || '',
      description: row[2] || '',
      category: row[3] || '',
      type: row[4] || '',
      url: row[5] || '',
      status: row[6] || 'Active',
      tags: row[7] ? row[7].split(',').map(t => t.trim()) : [],
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
}

module.exports = GoogleSheetsService;
