// ============================================================================
// GOOGLE SHEETS API INTEGRATION
// ============================================================================
// This file handles all communication with Google Sheets
// No modifications needed - it works automatically once you add credentials

class SheetsAPI {
    constructor() {
        this.isInitialized = false;
        this.isSignedIn = false;
        this.currentUser = null;
    }
    
    // Initialize Google API
    async init() {
        console.log('Initializing Sheets API...');
        
        // If using mock data, skip API initialization
        if (CONFIG.USE_MOCK_DATA) {
            console.log('✓ Running in MOCK DATA mode');
            console.log('  To use real data:');
            console.log('  1. Add credentials in config.js');
            console.log('  2. Set USE_MOCK_DATA to false');
            return true;
        }
        
        // Check if credentials are provided
        if (CONFIG.GOOGLE_CLIENT_ID.includes('YOUR_')) {
            console.error('❌ Google credentials not configured!');
            console.log('  Please add your credentials in js/config.js');
            return false;
        }
        
        // Load Google API
        return new Promise((resolve) => {
            gapi.load('client:auth2', async () => {
                try {
                    await gapi.client.init({
                        apiKey: CONFIG.GOOGLE_API_KEY,
                        clientId: CONFIG.GOOGLE_CLIENT_ID,
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                        scope: 'https://www.googleapis.com/auth/spreadsheets'
                    });
                    
                    this.isInitialized = true;
                    
                    // Listen for sign-in state changes
                    gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                        this.isSignedIn = isSignedIn;
                    });
                    
                    // Check if already signed in
                    this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
                    
                    console.log('✓ Google Sheets API initialized');
                    console.log('  Signed in:', this.isSignedIn);
                    
                    resolve(true);
                } catch (error) {
                    console.error('❌ Error initializing Google API:', error);
                    console.log('  Please check your credentials in config.js');
                    resolve(false);
                }
            });
        });
    }
    
    // Sign in with Google
    async signIn() {
        if (CONFIG.USE_MOCK_DATA) {
            // Mock sign in for demo
            this.currentUser = {
                isSignedIn: true,
                email: 'demo@gogrowth.com',
                name: 'Demo User',
                picture: null,
                role: 'admin'
            };
            return this.currentUser;
        }
        
        try {
            const auth = gapi.auth2.getAuthInstance();
            await auth.signIn();
            const user = auth.currentUser.get();
            const profile = user.getBasicProfile();
            
            this.currentUser = {
                isSignedIn: true,
                email: profile.getEmail(),
                name: profile.getName(),
                picture: profile.getImageUrl(),
                role: this.getUserRole(profile.getEmail())
            };
            
            console.log('✓ Signed in as:', this.currentUser.email);
            return this.currentUser;
        } catch (error) {
            console.error('Sign in error:', error);
            return { isSignedIn: false };
        }
    }
    
    // Sign out
    async signOut() {
        if (CONFIG.USE_MOCK_DATA) {
            this.currentUser = null;
            return;
        }
        
        const auth = gapi.auth2.getAuthInstance();
        await auth.signOut();
        this.currentUser = null;
        console.log('✓ Signed out');
    }
    
    // Get user role from config
    getUserRole(email) {
        return CONFIG.USER_ROLES[email] || 'member';
    }
    
    // Fetch all tasks from Google Sheet
    async fetchTasks() {
        if (CONFIG.USE_MOCK_DATA) {
            // Return mock data
            console.log('Loading mock data...');
            return MOCK_TASKS;
        }
        
        try {
            console.log('Fetching tasks from Google Sheet...');
            
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: `${CONFIG.TASKS_SHEET_NAME}!A2:I1000`,
            });
            
            const rows = response.result.values || [];
            const tasks = rows.map((row, index) => ({
                id: (index + 2).toString(),
                task: row[0] || '',
                assignedTo: row[1] || '',
                status: row[2] || 'Pending',
                client: row[3] || '',
                assignedOn: row[4] || '',
                deadline: row[5] || '',
                completedOn: row[6] || '',
                remarks: row[7] || ''
            }));
            
            console.log(`✓ Loaded ${tasks.length} tasks from sheet`);
            return tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
    
    // Add new task to sheet
    async addTask(task) {
        if (CONFIG.USE_MOCK_DATA) {
            // Add to mock data
            const newTask = {
                id: (MOCK_TASKS.length + 1).toString(),
                ...task,
                assignedOn: task.assignedOn || new Date().toISOString().split('T')[0]
            };
            MOCK_TASKS.push(newTask);
            console.log('✓ Task added to mock data');
            return newTask;
        }
        
        try {
            const values = [[
                task.task,
                task.assignedTo,
                task.status,
                task.client || '',
                task.assignedOn || new Date().toISOString().split('T')[0],
                task.deadline || '',
                task.completedOn || '',
                task.remarks || ''
            ]];
            
            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: `${CONFIG.TASKS_SHEET_NAME}!A:I`,
                valueInputOption: 'USER_ENTERED',
                resource: { values }
            });
            
            console.log('✓ Task added to Google Sheet');
            return task;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }
    
    // Update existing task in sheet
    async updateTask(taskId, updates) {
        if (CONFIG.USE_MOCK_DATA) {
            // Update in mock data
            const index = MOCK_TASKS.findIndex(t => t.id === taskId.toString());
            if (index !== -1) {
                MOCK_TASKS[index] = { ...MOCK_TASKS[index], ...updates };
                console.log('✓ Task updated in mock data');
                return MOCK_TASKS[index];
            }
            return null;
        }
        
        try {
            const rowNumber = parseInt(taskId);
            const values = [[
                updates.task,
                updates.assignedTo,
                updates.status,
                updates.client || '',
                updates.assignedOn || '',
                updates.deadline || '',
                updates.completedOn || '',
                updates.remarks || ''
            ]];
            
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: `${CONFIG.TASKS_SHEET_NAME}!A${rowNumber}:I${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values }
            });
            
            console.log('✓ Task updated in Google Sheet');
            return updates;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }
    
    // Delete task from sheet
    async deleteTask(taskId) {
        if (CONFIG.USE_MOCK_DATA) {
            // Remove from mock data
            const index = MOCK_TASKS.findIndex(t => t.id === taskId.toString());
            if (index !== -1) {
                MOCK_TASKS.splice(index, 1);
                console.log('✓ Task deleted from mock data');
                return true;
            }
            return false;
        }
        
        try {
            const rowNumber = parseInt(taskId);
            
            await gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                resource: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: 'ROWS',
                                startIndex: rowNumber - 1,
                                endIndex: rowNumber
                            }
                        }
                    }]
                }
            });
            
            console.log('✓ Task deleted from Google Sheet');
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
    
    async fetchResources() {
        if (CONFIG.USE_MOCK_DATA) {
            return typeof MOCK_RESOURCES !== 'undefined' ? MOCK_RESOURCES : [];
        }
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: `${CONFIG.RESOURCES_SHEET_NAME}!A2:G1000`,
            });
            const rows = response.result.values || [];
            return rows.map((row, index) => ({
                id: (index + 2).toString(),
                name: row[0] || '',
                description: row[1] || '',
                link: row[2] || '',
                tag: row[3] || '',
                remarks: row[4] || '',
                createdBy: row[5] || '',
                createdOn: row[6] || ''
            }));
        } catch (error) {
            console.error('Error fetching resources:', error);
            return [];
        }
    }
    
    async addResource(resource) {
        if (CONFIG.USE_MOCK_DATA) {
            const newResource = {
                id: (MOCK_RESOURCES.length + 1).toString(),
                ...resource,
                createdBy: this.currentUser?.email || 'demo@gogrowth.com',
                createdOn: new Date().toISOString().split('T')[0]
            };
            MOCK_RESOURCES.push(newResource);
            return newResource;
        }
        try {
            const values = [[
                resource.name,
                resource.description,
                resource.link,
                resource.tag,
                resource.remarks || '',
                this.currentUser?.email || '',
                new Date().toISOString().split('T')[0]
            ]];
            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: `${CONFIG.RESOURCES_SHEET_NAME}!A:G`,
                valueInputOption: 'USER_ENTERED',
                resource: { values }
            });
            return resource;
        } catch (error) {
            console.error('Error adding resource:', error);
            throw error;
        }
    }
    
    async updateResource(resourceId, updates) {
        if (CONFIG.USE_MOCK_DATA) {
            const index = MOCK_RESOURCES.findIndex(r => r.id === resourceId.toString());
            if (index !== -1) {
                MOCK_RESOURCES[index] = { ...MOCK_RESOURCES[index], ...updates };
                return MOCK_RESOURCES[index];
            }
            return null;
        }
        try {
            const rowNumber = parseInt(resourceId);
            const values = [[
                updates.name,
                updates.description,
                updates.link,
                updates.tag,
                updates.remarks || '',
                updates.createdBy || '',
                updates.createdOn || ''
            ]];
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                range: `${CONFIG.RESOURCES_SHEET_NAME}!A${rowNumber}:G${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values }
            });
            return updates;
        } catch (error) {
            console.error('Error updating resource:', error);
            throw error;
        }
    }
    
    async deleteResource(resourceId) {
        if (CONFIG.USE_MOCK_DATA) {
            const index = MOCK_RESOURCES.findIndex(r => r.id === resourceId.toString());
            if (index !== -1) {
                MOCK_RESOURCES.splice(index, 1);
                return true;
            }
            return false;
        }
        try {
            const rowNumber = parseInt(resourceId);
            await gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                resource: {
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: 1,
                                dimension: 'ROWS',
                                startIndex: rowNumber - 1,
                                endIndex: rowNumber
                            }
                        }
                    }]
                }
            });
            return true;
        } catch (error) {
            console.error('Error deleting resource:', error);
            throw error;
        }
    }
}

const sheetsAPI = new SheetsAPI();
console.log('✓ Sheets API module loaded');
