# Using Configuration in React Components

## Overview

Your GoGrowth OS Pro MERN app now uses the same configuration from your vanilla JS version. All the data (team members, clients, status options, colors, etc.) is centralized in `client/src/config.js`.

---

## Importing the Config

In any React component, import the config like this:

```javascript
import CONFIG from '../config';
```

Or with a relative path from your component location:

```javascript
import CONFIG from '../../config';  // If nested deeper
```

---

## Using Configuration in Components

### 1. **Team Members List**

```javascript
import CONFIG from '../config';

function TeamSelect() {
  return (
    <select>
      {CONFIG.TEAM_MEMBERS.map(member => (
        <option key={member} value={member}>
          {member}
        </option>
      ))}
    </select>
  );
}
```

### 2. **Status Dropdown**

```javascript
<select value={status} onChange={(e) => setStatus(e.target.value)}>
  {CONFIG.STATUS_OPTIONS.map(status => (
    <option key={status} value={status}>{status}</option>
  ))}
</select>
```

### 3. **Client Selection**

```javascript
<select value={client} onChange={(e) => setClient(e.target.value)}>
  {CONFIG.CLIENTS.map(client => (
    <option key={client} value={client}>{client}</option>
  ))}
</select>
```

### 4. **Resource Tags**

```javascript
<select value={tag} onChange={(e) => setTag(e.target.value)}>
  {CONFIG.RESOURCE_TAGS.map(tag => (
    <option key={tag} value={tag}>{tag}</option>
  ))}
</select>
```

### 5. **Colored Client Badges**

```javascript
function ClientBadge({ clientName }) {
  const color = CONFIG.CLIENT_COLORS[clientName] || '#6B7280';
  return (
    <span style={{ color, backgroundColor: color + '20' }}>
      {clientName}
    </span>
  );
}
```

### 6. **Tag with Pastel Colors**

```javascript
function ResourceTag({ tagName }) {
  const bgColor = CONFIG.TAG_COLORS[tagName];
  const textColor = CONFIG.TAG_TEXT_COLORS[tagName];
  
  return (
    <span style={{ 
      backgroundColor: bgColor, 
      color: textColor,
      padding: '4px 8px',
      borderRadius: '4px'
    }}>
      {tagName}
    </span>
  );
}
```

### 7. **Role-Based Permissions**

```javascript
function TaskActions({ userRole }) {
  const permissions = CONFIG.PERMISSIONS[userRole];
  
  return (
    <>
      {permissions.addTask && <button>Add Task</button>}
      {permissions.editAll && <button>Edit All Tasks</button>}
      {permissions.deleteTask && <button>Delete Task</button>}
      {permissions.exportData && <button>Export</button>}
    </>
  );
}
```

### 8. **Check User Permissions**

```javascript
import CONFIG from '../config';

function Dashboard({ userEmail }) {
  const userRole = CONFIG.USER_ROLES[userEmail] || 'member';
  const permissions = CONFIG.PERMISSIONS[userRole];
  
  if (!permissions.viewAll) {
    return <div>Access Denied</div>;
  }
  
  return <div>Dashboard Content</div>;
}
```

---

## Complete Example Components

### Example: Task Form Component

```javascript
import React, { useState } from 'react';
import CONFIG from '../config';
import { taskAPI } from '../services/api';

function TaskForm() {
  const [task, setTask] = useState({
    title: '',
    assignedTo: CONFIG.TEAM_MEMBERS[0],
    status: 'Pending',
    client: CONFIG.CLIENTS[0],
    priority: 'Medium',
    deadline: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.createTask(task);
      alert('Task created successfully!');
      setTask({
        title: '',
        assignedTo: CONFIG.TEAM_MEMBERS[0],
        status: 'Pending',
        client: CONFIG.CLIENTS[0],
        priority: 'Medium',
        deadline: '',
        description: ''
      });
    } catch (error) {
      alert('Error creating task: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        required
      />

      <select
        value={task.assignedTo}
        onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
      >
        {CONFIG.TEAM_MEMBERS.map(member => (
          <option key={member} value={member}>{member}</option>
        ))}
      </select>

      <select
        value={task.status}
        onChange={(e) => setTask({ ...task, status: e.target.value })}
      >
        {CONFIG.STATUS_OPTIONS.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      <select
        value={task.client}
        onChange={(e) => setTask({ ...task, client: e.target.value })}
      >
        {CONFIG.CLIENTS.map(client => (
          <option key={client} value={client}>{client}</option>
        ))}
      </select>

      <input
        type="date"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <button type="submit">Create Task</button>
    </form>
  );
}

export default TaskForm;
```

### Example: Team Members Card

```javascript
import React, { useState, useEffect } from 'react';
import CONFIG from '../config';
import { taskAPI } from '../services/api';

function TeamCard({ memberName }) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  useEffect(() => {
    loadMemberStats();
  }, []);

  const loadMemberStats = async () => {
    try {
      const tasks = await taskAPI.getAllTasks({ assignedTo: memberName });
      setStats({
        total: tasks.data.length,
        completed: tasks.data.filter(t => t.status === 'Completed').length,
        inProgress: tasks.data.filter(t => t.status === 'In progress').length,
        pending: tasks.data.filter(t => t.status === 'Pending').length
      });
    } catch (error) {
      console.error('Error loading member stats:', error);
    }
  };

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="team-card">
      <h3>{memberName}</h3>
      <div className="completion-badge">{completionRate}%</div>
      
      <div className="stats">
        <div>Completed: {stats.completed}</div>
        <div>In Progress: {stats.inProgress}</div>
        <div>Pending: {stats.pending}</div>
        <div>Total: {stats.total}</div>
      </div>
    </div>
  );
}

export default TeamCard;
```

### Example: Resource Filter

```javascript
import React, { useState } from 'react';
import CONFIG from '../config';

function ResourceFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    tag: 'all',
    search: ''
  });

  const handleTagChange = (tag) => {
    const newFilters = { ...filters, tag };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSearchChange = (search) => {
    const newFilters = { ...filters, search };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="filter-panel">
      <input
        type="search"
        placeholder="Search resources..."
        value={filters.search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      <select
        value={filters.tag}
        onChange={(e) => handleTagChange(e.target.value)}
      >
        <option value="all">All Tags</option>
        {CONFIG.RESOURCE_TAGS.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
    </div>
  );
}

export default ResourceFilter;
```

---

## Configuration Sections

### API Configuration
```javascript
CONFIG.API_BASE_URL          // Backend API URL
CONFIG.AUTO_REFRESH_INTERVAL // Auto-refresh interval in ms
```

### Google Sheets Configuration
```javascript
CONFIG.SPREADSHEET_ID        // Your Google Sheet ID
CONFIG.TASKS_SHEET_NAME      // Tasks sheet name ('All')
CONFIG.RESOURCES_SHEET_NAME  // Resources sheet name ('Resources')
```

### Team & Users
```javascript
CONFIG.TEAM_MEMBERS          // Array of team member names
CONFIG.USER_ROLES            // Email to role mapping
CONFIG.PERMISSIONS           // Role-based permissions object
```

### Data Options
```javascript
CONFIG.STATUS_OPTIONS        // Task status values
CONFIG.CLIENTS               // Client names
CONFIG.RESOURCE_TAGS         // Resource category tags
```

### Colors
```javascript
CONFIG.CLIENT_COLORS         // Client -> Color mapping
CONFIG.TAG_COLORS            // Tag -> Background color mapping
CONFIG.TAG_TEXT_COLORS       // Tag -> Text color mapping
```

---

## Updating Configuration

To update configuration values:

1. Edit `client/src/config.js`
2. Update the values you need to change
3. React will hot-reload (if you're using `npm start`)
4. Changes appear immediately in your app

Example: Adding a new team member
```javascript
TEAM_MEMBERS: [
  'Sidd',
  'Harsh',
  'Faisal',
  'Piyush',
  'Danish',
  'Armaan',
  'Rishav',
  'Rishabh',
  'NewMember'  // Added!
]
```

---

## Backend Integration

Your backend automatically uses the configuration from `server/.env`:

```env
GOOGLE_SHEET_ID=12UKRgjB4jtV6bAZYe16KhoBXgH95AatHHmyE2HA3P-U
GOOGLE_API_KEY=AIzaSyCUBY03axjeW_0e8mrq8v5n0xAX_zjciDc
TASKS_SHEET_NAME=All
RESOURCES_SHEET_NAME=Resources
```

The backend reads from `All` sheet for tasks and `Resources` sheet for resources, just like your original setup!

---

## Common Component Patterns

### 1. Dropdown Component
```javascript
<select onChange={(e) => setValue(e.target.value)}>
  {CONFIG.ARRAY_NAME.map(item => (
    <option key={item} value={item}>{item}</option>
  ))}
</select>
```

### 2. Conditional Rendering based on Role
```javascript
{CONFIG.PERMISSIONS[userRole].deleteTask && (
  <button onClick={deleteTask}>Delete</button>
)}
```

### 3. Color Mapping
```javascript
<span style={{ color: CONFIG.CLIENT_COLORS[clientName] }}>
  {clientName}
</span>
```

---

## Accessing from Dashboard Component

```javascript
import CONFIG from '../config';
import { taskAPI } from '../services/api';
import { useTasks } from '../hooks/useTasks';

function Dashboard() {
  const { tasks, filteredTasks, filters, loadTasks, updateFilters } = useTasks();

  return (
    <div>
      <h1>{CONFIG.APP_NAME}</h1>
      
      <select onChange={(e) => updateFilters({ ...filters, assignedTo: e.target.value })}>
        {CONFIG.TEAM_MEMBERS.map(member => (
          <option value={member}>{member}</option>
        ))}
      </select>

      <select onChange={(e) => updateFilters({ ...filters, status: e.target.value })}>
        {CONFIG.STATUS_OPTIONS.map(status => (
          <option value={status}>{status}</option>
        ))}
      </select>
    </div>
  );
}
```

---

## Pro Tips

1. **Use CONFIG in conditional logic**: Check team members, clients, and tags before rendering
2. **Color consistency**: Always use CONFIG.CLIENT_COLORS for client display
3. **Role-based UI**: Use CONFIG.PERMISSIONS to show/hide features
4. **Dropdowns**: Map CONFIG arrays to keep lists in sync
5. **Single source of truth**: Change values in config.js, they update everywhere

---

That's it! Your React components now have full access to all your original configuration data!
