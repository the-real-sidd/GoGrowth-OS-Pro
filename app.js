// ============================================================================
// MAIN APPLICATION LOGIC
// ============================================================================
// This file handles all dashboard functionality
// No modifications needed - it works automatically

class DashboardApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.filteredTasks = [];
        this.currentView = 'overview';
        this.filters = {
            assignedTo: 'all',
            status: 'all',
            client: 'all',
            search: '',
            dateRange: 'all',
            dateFrom: null,
            dateTo: null
        };
        this.sortBy = {
            field: 'deadline',
            direction: 'asc'
        };
        this.darkMode = localStorage.getItem('darkMode') === 'true';
    }
    
    // Initialize the app
    async init() {
        console.log('Initializing GoGrowth Dashboard...');
        this.showLoading(true);
        
        try {
            // Apply theme
            this.applyTheme();
            
            // Initialize Google Sheets API
            await sheetsAPI.init();
            
            // Auto sign in for demo/mock mode
            if (CONFIG.USE_MOCK_DATA) {
                this.currentUser = await sheetsAPI.signIn();
                this.showDashboard();
            }
            
            // Load tasks
            await this.loadTasks();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Populate dropdowns
            this.populateDropdowns();
            
            // Show initial view
            this.showView('overview');
            
            // Setup auto-refresh
            if (CONFIG.AUTO_REFRESH_INTERVAL > 0) {
                setInterval(() => this.loadTasks(true), CONFIG.AUTO_REFRESH_INTERVAL);
            }
            
            console.log('✓ Dashboard initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing dashboard:', error);
            this.showNotification('Error initializing dashboard. Please refresh the page.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    // Load tasks from API or mock data
    async loadTasks(silent = false) {
        if (!silent) this.showLoading(true);
        
        try {
            console.log('Fetching tasks...');
            this.tasks = await sheetsAPI.fetchTasks();
            console.log('Tasks fetched:', this.tasks.length);
            
            this.applyFilters();
            console.log('Filters applied, filtered tasks:', this.filteredTasks.length);
            
            this.updateStats();
            console.log('Stats updated');
            
            this.renderCurrentView();
            console.log('Current view rendered');
            
            if (!silent) {
                console.log(`✓ Loaded ${this.tasks.length} tasks`);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showNotification('Error loading tasks', 'error');
        }
        
        if (!silent) this.showLoading(false);
    }
    
    // Apply filters and sorting
    applyFilters() {
        let filtered = [...this.tasks];
        
        // Apply filters
        if (this.filters.assignedTo !== 'all') {
            filtered = filtered.filter(t => t.assignedTo === this.filters.assignedTo);
        }
        
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(t => t.status === this.filters.status);
        }
        
        if (this.filters.client !== 'all') {
            filtered = filtered.filter(t => t.client === this.filters.client);
        }
        
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(t => 
                (t.task && t.task.toLowerCase().includes(search)) ||
                (t.client && t.client.toLowerCase().includes(search)) ||
                (t.remarks && t.remarks.toLowerCase().includes(search))
            );
        }
        
        // Apply date range filter based on assignedOn date
        if (this.filters.dateRange !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            filtered = filtered.filter(t => {
                if (!t.assignedOn) return false;
                
                // Parse the date string (format: YYYY-MM-DD)
                const parts = t.assignedOn.split('-');
                const taskDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                taskDate.setHours(0, 0, 0, 0);
                
                switch(this.filters.dateRange) {
                    case 'today':
                        return taskDate.getTime() === today.getTime();
                    case 'yesterday':
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        return taskDate.getTime() === yesterday.getTime();
                    case 'this-week':
                        const weekStart = new Date(today);
                        weekStart.setDate(weekStart.getDate() - today.getDay());
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekEnd.getDate() + 6);
                        weekEnd.setHours(23, 59, 59, 999);
                        return taskDate >= weekStart && taskDate <= weekEnd;
                    case 'last-week':
                        const lastWeekStart = new Date(today);
                        lastWeekStart.setDate(lastWeekStart.getDate() - today.getDay() - 7);
                        const lastWeekEnd = new Date(lastWeekStart);
                        lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
                        lastWeekEnd.setHours(23, 59, 59, 999);
                        return taskDate >= lastWeekStart && taskDate <= lastWeekEnd;
                    case 'this-month':
                        return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
                    case 'last-month':
                        const lastMonth = new Date(today);
                        lastMonth.setMonth(lastMonth.getMonth() - 1);
                        return taskDate.getMonth() === lastMonth.getMonth() && taskDate.getFullYear() === lastMonth.getFullYear();
                    case 'custom':
                        if (this.filters.dateFrom && this.filters.dateTo) {
                            const fromParts = this.filters.dateFrom.split('-');
                            const dateFrom = new Date(parseInt(fromParts[0]), parseInt(fromParts[1]) - 1, parseInt(fromParts[2]));
                            dateFrom.setHours(0, 0, 0, 0);
                            
                            const toParts = this.filters.dateTo.split('-');
                            const dateTo = new Date(parseInt(toParts[0]), parseInt(toParts[1]) - 1, parseInt(toParts[2]));
                            dateTo.setHours(23, 59, 59, 999);
                            
                            return taskDate >= dateFrom && taskDate <= dateTo;
                        }
                        return true;
                    default:
                        return true;
                }
            });
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            const aVal = a[this.sortBy.field] || '';
            const bVal = b[this.sortBy.field] || '';
            
            if (this.sortBy.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        this.filteredTasks = filtered;
    }
    
    // Update statistics
    updateStats() {
        const stats = {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.status === 'Completed').length,
            inProgress: this.tasks.filter(t => t.status === 'In progress').length,
            pending: this.tasks.filter(t => t.status === 'Pending').length,
            overdue: this.getOverdueTasks().length
        };
        
        const completionRate = stats.total > 0 
            ? Math.round((stats.completed / stats.total) * 100) 
            : 0;
        
        // Update DOM
        this.updateElement('stat-total', stats.total);
        this.updateElement('stat-completed', stats.completed);
        this.updateElement('stat-progress', stats.inProgress);
        this.updateElement('stat-pending', stats.pending);
        this.updateElement('stat-overdue', stats.overdue);
        this.updateElement('stat-completion', completionRate + '%');
    }
    
    // Get overdue tasks
    getOverdueTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.tasks.filter(t => 
            t.status !== 'Completed' && 
            t.deadline && 
            t.deadline < today
        );
    }
    
    // Show different views
    showView(view) {
        this.currentView = view;
        
        // Update main nav (Dashboard/Resources)
        document.querySelectorAll('.main-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Map view to page for navigation highlighting
        const pageMap = {
            'dashboard': 'dashboard',
            'resources': 'resources',
            'overview': 'dashboard',
            'table': 'dashboard',
            'my-tasks': 'dashboard'
        };
        const page = pageMap[view];
        const navItem = document.querySelector(`[data-page="${page}"]`);
        if (navItem) navItem.classList.add('active');
        
        // Update task nav tabs (All Tasks, My Tasks, Team Overview)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const taskNavItem = document.querySelector(`[data-view="${view}"]`);
        if (taskNavItem) taskNavItem.classList.add('active');
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show selected page
        let pageElement;
        if (view === 'dashboard' || view === 'overview' || view === 'table' || view === 'my-tasks') {
            pageElement = document.getElementById('dashboard-page');
        } else if (view === 'resources') {
            pageElement = document.getElementById('resources-page');
        }
        
        if (pageElement) {
            pageElement.classList.add('active');
        }
        
        // Hide all views and show the selected one
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        
        let viewElement;
        if (view === 'overview') {
            viewElement = document.getElementById('overview-view');
        } else if (view === 'table') {
            viewElement = document.getElementById('table-view');
        } else if (view === 'my-tasks') {
            viewElement = document.getElementById('my-tasks-view');
        }
        
        if (viewElement) {
            viewElement.classList.add('active');
        }
        
        // Manage filter visibility based on view
        const toolbar = document.getElementById('task-toolbar');
        const searchFilter = document.getElementById('search-filter');
        const allFilters = document.getElementById('all-filters');
        
        if (toolbar && searchFilter && allFilters) {
            if (view === 'overview') {
                // Hide all filters and search for Team Overview
                toolbar.style.display = 'none';
            } else if (view === 'table') {
                // Show all filters for All Tasks
                toolbar.style.display = 'flex';
                searchFilter.style.display = 'block';
                allFilters.style.display = 'flex';
                
                // Make sure all filter selects are visible
                allFilters.querySelectorAll('select').forEach(select => {
                    select.style.display = 'block';
                });
            } else if (view === 'my-tasks') {
                // Show only status and client filters for My Tasks
                toolbar.style.display = 'flex';
                searchFilter.style.display = 'none';
                
                // Hide all filters first, then show only status and client
                allFilters.querySelectorAll('select').forEach(select => {
                    select.style.display = 'none';
                });
                
                const statusSelect = document.getElementById('filter-status');
                const clientSelect = document.getElementById('filter-client');
                if (statusSelect) statusSelect.style.display = 'block';
                if (clientSelect) clientSelect.style.display = 'block';
            }
        }
        
        this.renderCurrentView();
    }
    

    // Render current view
    renderCurrentView() {
        switch(this.currentView) {
            case 'dashboard':
            case 'overview':
                this.renderOverview();
                break;
            case 'table':
                this.renderTable();
                break;
            case 'my-tasks':
                this.renderMyTasks();
                break;
            case 'resources':
                this.renderResources();
                break;
        }
    }
    
    // Render overview (team cards)
    renderOverview() {
        const container = document.getElementById('team-cards-container');
        if (!container) return;
        
        const teamStats = this.getTeamStats();
        
        container.innerHTML = teamStats.map(member => `
            <div class="team-card">
                <div class="team-card-header">
                    <div class="member-info">
                        <div class="avatar">${this.getInitials(member.name)}</div>
                        <div class="member-details">
                            <h3>${this.escapeHtml(member.name)}</h3>
                            <p class="member-role">MEMBER</p>
                        </div>
                    </div>
                    <div class="completion-badge">${member.completionRate}%</div>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${member.completionRate}%"></div>
                </div>
                
                <div class="stats-row">
                    <div class="stat-box">
                        <div class="stat-value">${member.completed}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${member.active}</div>
                        <div class="stat-label">Active</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${member.total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>
                
                <div class="recent-tasks">
                    <h4>Active Tasks</h4>
                    ${member.activeTasks.length > 0 ? member.activeTasks.map(task => `
                        <div class="task-item-mini">
                            <div class="task-name">${this.escapeHtml(task.task)}</div>
                            <div class="task-meta">
                                ${task.client ? `<span class="task-client">${this.escapeHtml(task.client)}</span>` : ''}
                                ${task.deadline ? `<span class="task-deadline">${this.formatDate(task.deadline)}</span>` : ''}
                            </div>
                        </div>
                    `).join('') : '<p class="no-tasks">No active tasks</p>'}
                </div>
            </div>
        `).join('');
    }
    
    // Get team statistics
    getTeamStats() {
        return CONFIG.TEAM_MEMBERS.map(name => {
            const memberTasks = this.tasks.filter(t => t.assignedTo === name);
            const completed = memberTasks.filter(t => t.status === 'Completed').length;
            const active = memberTasks.filter(t => t.status === 'In progress').length;
            const total = memberTasks.length;
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
            const activeTasks = memberTasks
                .filter(t => t.status === 'In progress')
                .slice(0, 3);
            
            return { name, completed, active, total, completionRate, activeTasks };
        });
    }
    
    // Render table view
    renderTable() {
        const container = document.getElementById('tasks-list');
        if (!container) return;
        
        if (this.filteredTasks.length === 0) {
            container.innerHTML = '<p class="no-tasks">No tasks found</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="tasks-table">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Assigned On</th>
                        <th>Deadline</th>
                        <th>Completed On</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredTasks.map(task => {
                        const isOverdue = this.isOverdue(task);
                        return `
                            <tr class="${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
                                <td>
                                    <div class="task-cell">
                                        ${task.client ? `<div class="client-name" style="color: ${this.getClientColor(task.client)}">${this.escapeHtml(task.client)}</div>` : ''}
                                        <div class="task-name">${this.escapeHtml(task.task)}</div>
                                    </div>
                                </td>
                                <td>${this.escapeHtml(task.assignedTo)}</td>
                                <td>
                                    <select class="status-dropdown" data-task-id="${task.id}">
                                        ${CONFIG.STATUS_OPTIONS.map(status => `
                                            <option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>
                                        `).join('')}
                                    </select>
                                </td>
                                <td>${this.formatDate(task.assignedOn)}</td>
                                <td class="${isOverdue ? 'text-danger' : ''}">${this.formatDate(task.deadline)}</td>
                                <td>${this.formatDate(task.completedOn)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    
    // Render my tasks
    renderMyTasks() {
        const container = document.getElementById('my-tasks-list');
        if (!container) return;
        
        const myTasks = this.filteredTasks.slice(0, 50);
        
        if (myTasks.length === 0) {
            container.innerHTML = '<p class="no-tasks">No tasks found</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="tasks-table">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${myTasks.map(task => {
                        const isOverdue = this.isOverdue(task);
                        return `
                            <tr class="${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
                                <td>
                                    <div class="task-cell">
                                        ${task.client ? `<div class="client-name" style="color: ${this.getClientColor(task.client)}">${this.escapeHtml(task.client)}</div>` : ''}
                                        <div class="task-name">${this.escapeHtml(task.task)}</div>
                                    </div>
                                </td>
                                <td>
                                    <select class="status-dropdown" data-task-id="${task.id}">
                                        ${CONFIG.STATUS_OPTIONS.map(status => `
                                            <option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>
                                        `).join('')}
                                    </select>
                                </td>
                                <td class="${isOverdue ? 'text-danger' : ''}">${this.formatDate(task.deadline)}</td>
                                <td>${this.escapeHtml(task.remarks)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    
    // Get tag color (pastel colors)
    getTagColor(tag) {
        const tagColors = {
            'SEO': '#FFE5E5',          // Pastel red
            'Ads': '#E5F3FF',          // Pastel blue
            'Website': '#FFF5E5',      // Pastel orange
            'N8N': '#E5FFEF',          // Pastel green
            'Design': '#F5E5FF',       // Pastel purple
            'Development': '#FFE5F5',  // Pastel pink
            'Marketing': '#FFFFE5',    // Pastel yellow
            'Analytics': '#E5FFFF',    // Pastel cyan
            'Other': '#F0F0F0'         // Light gray
        };
        return tagColors[tag] || '#F0F0F0';
    }
    
    // Get tag text color (darker shade for contrast)
    getTagTextColor(tag) {
        const tagTextColors = {
            'SEO': '#CC0000',          // Darker red
            'Ads': '#0066CC',          // Darker blue
            'Website': '#CC6600',      // Darker orange
            'N8N': '#009933',          // Darker green
            'Design': '#6600CC',       // Darker purple
            'Development': '#CC0066',  // Darker pink
            'Marketing': '#CCAA00',    // Darker yellow
            'Analytics': '#0099CC',    // Darker cyan
            'Other': '#666666'         // Dark gray
        };
        return tagTextColors[tag] || '#666666';
    }
    
    // Render resources section
    renderResources() {
        const container = document.getElementById('resources-container');
        if (!container) return;
        
        let resources = MOCK_RESOURCES || [];
        
        // Apply filters
        const searchInput = document.getElementById('search-resource');
        const tagFilter = document.getElementById('filter-tag');
        
        if (searchInput && searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            resources = resources.filter(r => 
                r.name.toLowerCase().includes(searchTerm) ||
                r.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (tagFilter && tagFilter.value !== 'all') {
            resources = resources.filter(r => r.tag === tagFilter.value);
        }
        
        if (resources.length === 0) {
            container.innerHTML = '<p class="no-resources">No resources found</p>';
            return;
        }
        
        container.innerHTML = resources.map(resource => {
            const tagBg = this.getTagColor(resource.tag);
            const tagTextColor = this.getTagTextColor(resource.tag);
            return `
            <a href="${resource.link}" target="_blank" rel="noopener noreferrer" class="resource-card" style="border: 1px solid ${tagBg};">
                <div class="resource-header">
                    <div class="resource-info">
                        <h3>${this.escapeHtml(resource.name)}</h3>
                    </div>
                    <span class="resource-tag" style="background-color: ${tagBg}; color: ${tagTextColor}; border: 1px solid ${tagTextColor};">${this.escapeHtml(resource.tag)}</span>
                </div>
                
                <p class="resource-description">${this.escapeHtml(resource.description)}</p>
                
                <div class="resource-body">
                    ${resource.remarks ? `<p class="resource-remarks"><strong>Note:</strong> ${this.escapeHtml(resource.remarks)}</p>` : ''}
                    <div class="resource-meta">
                        <span class="resource-created">Created by ${this.escapeHtml(resource.createdBy)} on ${this.formatDate(resource.createdOn)}</span>
                    </div>
                </div>
            </a>
        `}).join('');
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Main Navigation (Dashboard/Resources)
        document.querySelectorAll('.main-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page) {
                    // Map page to view name
                    const viewMap = {
                        'dashboard': 'overview',
                        'resources': 'resources'
                    };
                    const view = viewMap[page] || page;
                    this.showView(view);
                }
            });
        });
        
        // Task Navigation Tabs (Team Overview, All Tasks, My Tasks)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.showView(view);
                }
            });
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Add task button
        const btnAddTask = document.getElementById('btn-add-task');
        if (btnAddTask) {
            btnAddTask.addEventListener('click', () => this.showAddTaskModal());
        }
        
        // Filters
        const filterAssignedTo = document.getElementById('filter-assignedTo');
        if (filterAssignedTo) {
            filterAssignedTo.addEventListener('change', (e) => {
                this.filters.assignedTo = e.target.value;
                this.applyFilters();
                this.renderCurrentView();
            });
        }
        
        const filterStatus = document.getElementById('filter-status');
        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.applyFilters();
                this.renderCurrentView();
            });
        }
        
        const filterClient = document.getElementById('filter-client');
        if (filterClient) {
            filterClient.addEventListener('change', (e) => {
                this.filters.client = e.target.value;
                this.applyFilters();
                this.renderCurrentView();
            });
        }
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
                this.renderCurrentView();
            });
        }
        
        // Stats date filter
        const statsDateFilter = document.getElementById('stats-date-filter');
        if (statsDateFilter) {
            statsDateFilter.addEventListener('change', (e) => {
                console.log('Date filter changed to:', e.target.value);
                this.filters.dateRange = e.target.value;
                if (e.target.value === 'custom') {
                    console.log('Showing custom date range');
                    document.getElementById('custom-date-range').style.display = 'flex';
                } else {
                    console.log('Hiding custom date range, applying filters');
                    document.getElementById('custom-date-range').style.display = 'none';
                    this.applyFilters();
                    console.log('Filtered tasks count:', this.filteredTasks.length);
                    this.renderCurrentView();
                }
            });
        }
        
        // Apply custom date range
        const applyDateRange = document.getElementById('apply-date-range');
        if (applyDateRange) {
            applyDateRange.addEventListener('click', () => {
                const dateFrom = document.getElementById('date-from').value;
                const dateTo = document.getElementById('date-to').value;
                if (dateFrom && dateTo) {
                    this.filters.dateFrom = dateFrom;
                    this.filters.dateTo = dateTo;
                    this.applyFilters();
                    this.renderCurrentView();
                }
            });
        }
        
        // Sort headers
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                const field = e.currentTarget.dataset.sort;
                if (this.sortBy.field === field) {
                    this.sortBy.direction = this.sortBy.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortBy.field = field;
                    this.sortBy.direction = 'asc';
                }
                this.applyFilters();
                this.renderTable();
            });
        });
        
        // Status dropdown change listener
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-dropdown')) {
                const taskId = e.target.dataset.taskId;
                const newStatus = e.target.value;
                const task = this.allTasks.find(t => t.id === taskId);
                if (task) {
                    task.status = newStatus;
                    // Update on Google Sheets
                    this.sheetsAPI.updateTask(taskId, { status: newStatus }).catch(err => {
                        console.error('Error updating task status:', err);
                    });
                    // Refresh the view
                    this.applyFilters();
                    this.renderCurrentView();
                }
            }
        });
        
        // Resource filters
        const searchResource = document.getElementById('search-resource');
        if (searchResource) {
            searchResource.addEventListener('input', () => {
                this.renderResources();
            });
        }
        
        const filterTag = document.getElementById('filter-tag');
        if (filterTag) {
            filterTag.addEventListener('change', () => {
                this.renderResources();
            });
        }
        
        // Modal close
        document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
            el.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal && modal.id === 'resource-modal') {
                    this.closeResourceModal();
                } else {
                    this.closeModal();
                }
            });
        });
        
        // Task form
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTask();
            });
        }
        
        // Add resource button
        const btnAddResource = document.getElementById('btn-add-resource');
        if (btnAddResource) {
            btnAddResource.addEventListener('click', () => this.showAddResourceModal());
        }
        
        // Resource form
        const resourceForm = document.getElementById('resource-form');
        if (resourceForm) {
            resourceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveResource();
            });
        }
    }
    
    // Show add resource modal
    showAddResourceModal() {
        const modal = document.getElementById('resource-modal');
        const form = document.getElementById('resource-form');
        const title = document.getElementById('resource-modal-title');
        
        if (form) form.reset();
        if (title) title.textContent = 'Add New Resource';
        document.getElementById('resource-id').value = '';
        
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    // Save resource
    saveResource() {
        try {
            const id = document.getElementById('resource-id').value;
            const name = document.getElementById('resource-name').value;
            const description = document.getElementById('resource-description').value;
            const link = document.getElementById('resource-link').value;
            const tag = document.getElementById('resource-tag').value;
            const remarks = document.getElementById('resource-remarks').value;
            
            console.log('Saving resource:', { id, name, description, link, tag, remarks });
            
            if (!name || !description || !link || !tag) {
                alert('Please fill in all required fields');
                return;
            }
            
            const resource = {
                id: id || 'resource_' + Date.now(),
                name,
                description,
                link,
                tag,
                remarks,
                createdBy: 'Current User',
                createdOn: new Date().toISOString().split('T')[0]
            };
            
            console.log('Created resource object:', resource);
            
            // Add or update in mock data
            if (id) {
                const index = MOCK_RESOURCES.findIndex(r => r.id === id);
                if (index !== -1) {
                    MOCK_RESOURCES[index] = resource;
                }
            } else {
                MOCK_RESOURCES.push(resource);
                console.log('Resource added to MOCK_RESOURCES, total:', MOCK_RESOURCES.length);
            }
            
            // Save to Google Sheets
            if (this.sheetsAPI && typeof this.sheetsAPI.addResource === 'function') {
                this.sheetsAPI.addResource(resource).catch(err => {
                    console.error('Error saving resource to Google Sheets:', err);
                });
            }
            
            // Close modal
            this.closeResourceModal();
            console.log('Modal closed');
            
            // Show success notification
            this.showNotification(`"${this.escapeHtml(name)}" has been added`, 'success');
            console.log('Notification shown');
            
            // Refresh resources
            this.renderResources();
            console.log('Resources re-rendered');
        } catch (error) {
            console.error('Error in saveResource:', error);
            alert('Error saving resource: ' + error.message);
        }
    }
    
    // Close resource modal
    closeResourceModal() {
        const modal = document.getElementById('resource-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    // Populate dropdowns
    populateDropdowns() {
        // Team members
        const assignedToFilter = document.getElementById('filter-assignedTo');
        const assignedToSelect = document.getElementById('task-assignedTo');
        
        if (assignedToFilter && assignedToSelect) {
            CONFIG.TEAM_MEMBERS.forEach(member => {
                assignedToFilter.innerHTML += `<option value="${member}">${member}</option>`;
                assignedToSelect.innerHTML += `<option value="${member}">${member}</option>`;
            });
        }
        
        // Clients
        const clientFilter = document.getElementById('filter-client');
        const clientSelect = document.getElementById('task-client');
        
        if (clientFilter && clientSelect) {
            CONFIG.CLIENTS.forEach(client => {
                clientFilter.innerHTML += `<option value="${client}">${client}</option>`;
                clientSelect.innerHTML += `<option value="${client}">${client}</option>`;
            });
        }
    }
    
    // Show add task modal
    showAddTaskModal() {
        const modalTitle = document.getElementById('modal-title');
        const taskForm = document.getElementById('task-form');
        const taskId = document.getElementById('task-id');
        
        if (modalTitle) modalTitle.textContent = 'Add New Task';
        if (taskForm) taskForm.reset();
        if (taskId) taskId.value = '';
        
        this.showModal();
    }
    
    // Edit task
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId.toString());
        if (!task) return;
        
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) modalTitle.textContent = 'Edit Task';
        
        this.updateElement('task-id', task.id, 'value');
        this.updateElement('task-name', task.task, 'value');
        this.updateElement('task-assignedTo', task.assignedTo, 'value');
        this.updateElement('task-status', task.status, 'value');
        this.updateElement('task-client', task.client, 'value');
        this.updateElement('task-deadline', task.deadline, 'value');
        this.updateElement('task-remarks', task.remarks, 'value');
        
        this.showModal();
    }
    
    // Delete task
    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        this.showLoading(true);
        
        try {
            await sheetsAPI.deleteTask(taskId);
            this.showNotification('Task deleted successfully', 'success');
            await this.loadTasks();
        } catch (error) {
            console.error('Delete error:', error);
            this.showNotification('Error deleting task', 'error');
        }
        
        this.showLoading(false);
    }
    
    // Save task
    async saveTask() {
        const taskId = document.getElementById('task-id')?.value;
        const taskData = {
            task: document.getElementById('task-name')?.value || '',
            assignedTo: document.getElementById('task-assignedTo')?.value || '',
            status: document.getElementById('task-status')?.value || 'Pending',
            client: document.getElementById('task-client')?.value || '',
            deadline: document.getElementById('task-deadline')?.value || '',
            remarks: document.getElementById('task-remarks')?.value || ''
        };
        
        this.showLoading(true);
        this.closeModal();
        
        try {
            if (taskId) {
                await sheetsAPI.updateTask(taskId, taskData);
                this.showNotification('Task updated successfully', 'success');
            } else {
                await sheetsAPI.addTask(taskData);
                this.showNotification('Task added successfully', 'success');
            }
            
            await this.loadTasks();
        } catch (error) {
            console.error('Save error:', error);
            this.showNotification('Error saving task', 'error');
        }
        
        this.showLoading(false);
    }
    
    // Modal helpers
    showModal() {
        const modal = document.getElementById('task-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        const modal = document.getElementById('task-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Theme toggle
    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyTheme();
    }
    
    applyTheme() {
        if (this.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    // Loading state
    showLoading(show) {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }
    
    // Show dashboard
    showDashboard() {
        const loginView = document.getElementById('login-view');
        const dashboardView = document.getElementById('dashboard-view');
        
        if (loginView) loginView.classList.add('hidden');
        if (dashboardView) dashboardView.classList.remove('hidden');
    }
    
    // Notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Utility functions
    updateElement(id, value, property = 'textContent') {
        const element = document.getElementById(id);
        if (element) element[property] = value;
    }
    
    getInitials(name) {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    }
    
    isOverdue(task) {
        if (!task.deadline || task.status === 'Completed') return false;
        const today = new Date().toISOString().split('T')[0];
        return task.deadline < today;
    }
    
    getStatusClass(status) {
        const map = {
            'Completed': 'completed',
            'In progress': 'progress',
            'Pending': 'pending',
            'On Hold': 'hold',
            'Cancelled': 'cancelled'
        };
        return map[status] || 'pending';
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getClientColor(clientName) {
        const colors = {
            'Swingsaga': '#EF4444',
            'Inkup': '#3B82F6',
            'Craft Delights': '#FBBF24',
            'Anything Vegan': '#10B981',
            'Mimamsaa': '#A855F7',
            'Banter Kitchen': '#F97316',
            'Go Growth': '#06B6D4',
            'NDNY': '#EC4899'
        };
        return colors[clientName] || '#6B7280';
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app...');
    app = new DashboardApp();
    app.init();
});

console.log('✓ App module loaded');
