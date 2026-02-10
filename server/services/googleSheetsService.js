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
        filtered = filtered.filter(
          t => t.status === filters.status.trim().toLowerCase()
        );
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

  // Update task
  async updateTask(id, taskData) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.tasksSheetName}!A:L`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);

      if (rowIndex === -1) return null;

      // Build updated row
      const updatedRow = [
        id,
        taskData.title || rows[rowIndex][1],
        taskData.description || rows[rowIndex][2],
        taskData.priority || rows[rowIndex][3],
        taskData.status || rows[rowIndex][4],
        taskData.assignedTo || rows[rowIndex][5],
        taskData.client || rows[rowIndex][6],
        taskData.deadline || rows[rowIndex][7],
        taskData.tags ? taskData.tags.join(', ') : rows[rowIndex][8],
        rows[rowIndex][9],
        new Date().toISOString(),
        ''
      ];

      // Update the row
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.tasksSheetName}!A${rowIndex + 1}:L${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [updatedRow] }
      });

      return { _id: id, ...taskData, updatedAt: new Date() };
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  // Delete task
  async deleteTask(id) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.tasksSheetName}!A:L`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);

      if (rowIndex === -1) throw new Error('Task not found');

      // Delete the row by clearing it
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${this.tasksSheetName}!A${rowIndex + 1}:L${rowIndex + 1}`
      });

      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }

  // Update resource
  async updateResource(id, resourceData) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.resourcesSheetName}!A:H`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);

      if (rowIndex === -1) return null;

      // Build updated row
      const updatedRow = [
        id,
        resourceData.title || rows[rowIndex][1],
        resourceData.description || rows[rowIndex][2],
        resourceData.category || rows[rowIndex][3],
        resourceData.type || rows[rowIndex][4],
        resourceData.url || rows[rowIndex][5],
        resourceData.status || rows[rowIndex][6],
        resourceData.tags ? resourceData.tags.join(', ') : rows[rowIndex][7]
      ];

      // Update the row
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.resourcesSheetName}!A${rowIndex + 1}:H${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [updatedRow] }
      });

      return { _id: id, ...resourceData, updatedAt: new Date() };
    } catch (error) {
      console.error('Error updating resource:', error);
      throw new Error('Failed to update resource');
    }
  }

  // Delete resource
  async deleteResource(id) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.resourcesSheetName}!A:H`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);

      if (rowIndex === -1) throw new Error('Resource not found');

      // Delete the row by clearing it
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${this.resourcesSheetName}!A${rowIndex + 1}:H${rowIndex + 1}`
      });

      return true;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw new Error('Failed to delete resource');
    }
  }

  // Get statistics
  async getStatistics() {
  try {
    const tasks = await this.getAllTasks();

    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in progress').length,
      pending: tasks.filter(t => t.status === 'pending').length
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}


  // Parse tasks from sheet rows
  parseTasksFromSheet(rows) {
    return rows.map((row, index) => {
      // Column structure:
      // A: Task (title)
      // B: Assigned to
      // C: Status
      // D: For Client
      // E: Assigned on
      // F: Deadline
      // G: Completed On
      // H: Remarks (description)
      // I: Resources (tags)
      
      return {
        _id: `task-${index}-${Date.now()}`,
        title: row[0] || '',
        description: row[7] || '',
        priority: 'Medium',
        status: (row[2] || 'pending').trim().toLowerCase(),
        assignedTo: row[1] || 'Unassigned',
        client: row[3] || '',
        deadline: row[5] || '',
        completedOn: row[6] || '',
        tags: row[8] ? row[8].split(',').map(t => t.trim()) : [],
        createdAt: row[4] ? new Date(row[4]) : new Date(),
        updatedAt: new Date()
      };
    });
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
