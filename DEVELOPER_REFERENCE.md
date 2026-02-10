# 🔧 Developer Quick Reference

Fast lookup guide for common tasks and files.

## 🚀 Quick Commands

```bash
# Start Backend
cd server && npm start

# Start Frontend  
cd client && npm start

# Start with auto-reload
cd server && npm run dev        # (needs nodemon)
cd client && npm start          # (auto-reload built-in)

# Build for production
cd client && npm run build

# Install all dependencies
npm install                     # (in both folders)
```

## 📁 Where to Find Things

### Styling / Colors
- **Global CSS variables**: `client/src/index.css`
- **Component styles**: `client/src/styles/`
- **Change colors**: Edit `--color-*` variables in `index.css`

### React Components
- **Main app**: `client/src/App.js`
- **Pages**: `client/src/pages/`
- **Components**: `client/src/components/`
- **Custom hooks**: `client/src/hooks/`

### Backend / API
- **Main server**: `server/server.js`
- **Routes**: `server/routes/`
- **Controllers**: `server/controllers/`
- **Database models**: `server/models/`

### Configuration
- **Backend config**: `server/.env`
- **Frontend config**: `client/.env`
- **API client**: `client/src/services/api.js`

## 🎨 Customization

### Change App Colors
```css
/* In client/src/index.css */
:root {
  --color-primary: #2563eb;        /* Blue */
  --color-success: #16a34a;        /* Green */
  --color-danger: #dc2626;         /* Red */
  --color-warning: #ea580c;        /* Orange */
  --color-bg: #fafafa;             /* Light background */
}
```

### Change API Endpoint
```javascript
// In client/.env
REACT_APP_API_URL=http://localhost:5000/api
// or for production:
REACT_APP_API_URL=https://your-api.com/api
```

### Change Database
```bash
# In server/.env
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/gogrowth

# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gogrowth
```

### Change Port
```bash
# In server/.env (default 5000)
PORT=5000

# Frontend runs on port 3000 (set in package.json)
```

## 🧩 Adding Features

### Add New Page Component

1. Create file: `client/src/pages/MyPage.js`
   ```javascript
   import React, { useEffect } from 'react';
   import '../styles/mypage.css';

   const MyPage = () => {
     useEffect(() => {
       // Initialize page
     }, []);

     return (
       <div className="my-page">
         <h1>My Page</h1>
       </div>
     );
   };

   export default MyPage;
   ```

2. Add route in `client/src/App.js`
   ```javascript
   <Route path="/mypage" element={<MyPage />} />
   ```

3. Add navigation in `client/src/components/Header.js`
   ```javascript
   <button className="main-nav-item" data-page="mypage">
     My Page
   </button>
   ```

4. Add CSS file: `client/src/styles/mypage.css`

### Add New API Endpoint

1. Create controller in `server/controllers/`
   ```javascript
   exports.getMyData = async (req, res) => {
     try {
       // Logic here
       res.json(data);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   ```

2. Create model in `server/models/` if needed

3. Add route in `server/routes/myRoutes.js`
   ```javascript
   const express = require('express');
   const router = express.Router();
   const myController = require('../controllers/myController');

   router.get('/', myController.getMyData);

   module.exports = router;
   ```

4. Register route in `server/server.js`
   ```javascript
   app.use('/api/mydata', require('./routes/myRoutes'));
   ```

5. Call from frontend `client/src/services/api.js`
   ```javascript
   export const myAPI = {
     getMyData: () => apiClient.get('/mydata')
   };
   ```

### Create New Custom Hook

1. Create file: `client/src/hooks/useMyData.js`
   ```javascript
   import { useState, useCallback } from 'react';
   import { myAPI } from '../services/api';

   export const useMyData = () => {
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(false);

     const loadData = useCallback(async () => {
       setLoading(true);
       try {
         const response = await myAPI.getMyData();
         setData(response.data);
       } catch (error) {
         console.error('Error loading data:', error);
       } finally {
         setLoading(false);
       }
     }, []);

     return { data, loading, loadData };
   };
   ```

2. Use in component
   ```javascript
   const { data, loading, loadData } = useMyData();
   
   useEffect(() => {
     loadData();
   }, [loadData]);
   ```

## 🐛 Debugging

### Debug Frontend
```javascript
// Add console logs
console.log('Variable:', variable);

// Check React DevTools (install browser extension)
// Check Network tab in DevTools (F12)
// Check Console tab errors

// Breakpoints in VS Code
// Set breakpoint in code
// Run: node --inspect server/server.js
```

### Debug Backend
```javascript
// Add console logs
console.log('Data:', data);

// Check server logs in terminal
// Use MongoDB Compass to view database
// Test endpoints with Postman or curl

// curl example:
// curl -X GET http://localhost:5000/api/tasks/stats
```

### Debug API Calls
```javascript
// In browser DevTools, Network tab:
// 1. Look at Request headers
// 2. Check Authorization token
// 3. Review Response data
// 4. Check status codes (200, 404, 500, etc)
```

## 📊 Common File Patterns

### Service Call Pattern
```javascript
// In component or hook
const response = await taskAPI.getAllTasks({ status: 'Completed' });
const data = response.data;
```

### Hook Pattern
```javascript
const { tasks, loading, error, createTask } = useTasks();

useEffect(() => {
  loadTasks();
}, [loadTasks]);

const handleCreate = async (taskData) => {
  try {
    await createTask(taskData);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Component Pattern
```javascript
const MyComponent = () => {
  const [state, setState] = useState();

  useEffect(() => {
    // Load data
  }, []);

  const handleAction = () => {
    // Handle action
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `server/server.js` | Express server entry point |
| `client/src/App.js` | React root component |
| `client/src/index.js` | React DOM entry |
| `client/src/services/api.js` | All API calls |
| `client/src/hooks/useTasks.js` | Task state logic |
| `server/routes/taskRoutes.js` | Task endpoints |
| `server/controllers/taskController.js` | Task logic |
| `server/models/Task.js` | Task schema |
| `.env` (both folders) | Configuration |

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Module not found | `npm install` in that folder |
| Port in use | Change PORT in .env or kill process |
| CORS error | Check backend running & REACT_APP_API_URL |
| MongoDB error | Use `USE_MOCK_DATA=true` or fix MONGODB_URI |
| Can't connect to API | Check both servers running, check network tab |
| Styles not applied | Verify CSS file imported, check class names |
| Button not working | Check onClick handler, check console errors |
| Data not saving | Check MongoDB connection, check API response |

## 📚 Learn More

- **React**: https://react.dev
- **Express**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Axios**: https://axios-http.com/
- **CSSVariables**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*

## 💡 Best Practices

✅ **DO:**
- Keep components small and focused
- Use hooks for state management
- Put API calls in services/hooks
- Organize CSS by component
- Use error handling
- Add loading states
- Write meaningful variable names

❌ **DON'T:**
- Put too much logic in components
- Make direct API calls in components
- Hard-code URLs and values
- Commit .env files
- Mix concerns (styles, logic, UI)
- Ignore error handling
- Use `var`, use `const` or `let`

## 🎯 Quick Wins (Easy Customizations)

1. **Change dark theme colors**
   - Edit `:root.dark` in `client/src/index.css`

2. **Change logo/title**
   - Edit `<h1 className="logo">` in Header.js

3. **Change button text**
   - Find button element, change text

4. **Change field labels**
   - Find label elements in forms

5. **Add new status filter**
   - Add option to status select in TaskModal.js

6. **Change statistics cards**
   - Edit Statistics.js component

7. **Add new badge colors**
   - Add CSS class in respective CSS file

## 📞 When Stuck

1. **Check browser console**: F12 → Console tab
2. **Check server logs**: Terminal output
3. **Read error message carefully**: Usually tells you what's wrong
4. **Check .env files**: Ensure all values correct
5. **Review network requests**: F12 → Network tab
6. **Restart servers**: Kill and restart both
7. **Check documentation**: MERN_SETUP.md, ARCHITECTURE.md

---

**Happy coding!** 🚀

Keep this file bookmarked for quick reference while developing.
