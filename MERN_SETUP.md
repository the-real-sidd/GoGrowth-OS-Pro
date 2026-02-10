# MERN Stack Setup & Installation Guide

## Project Structure

Your project has been converted from vanilla JS to a full MERN (MongoDB, Express, React, Node.js) stack with proper separation of concerns:

```
GoGrowth-OS-Pro/
├── server/                 # Backend (Express + MongoDB)
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB schemas
│   ├── controllers/       # Route handlers
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & custom middleware
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env              # Environment variables
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service
│   │   ├── styles/       # CSS files
│   │   ├── App.js        # Main app component
│   │   └── index.js      # React entry point
│   ├── public/           # Static files
│   ├── package.json
│   └── .env              # Environment variables
│
└── MERN_SETUP.md         # This file
```

## Features Migrated

All your original features have been converted into proper React components:

- ✅ **Dashboard** - Task management with real-time stats
- ✅ **Task Management** - Create, Read, Update, Delete tasks
- ✅ **Filtering & Search** - Filter by status, assigned user, client
- ✅ **Resources Page** - Manage and categorize resources
- ✅ **Statistics** - Task statistics and overview
- ✅ **Dark/Light Mode** - Theme switching
- ✅ **User Management** - Login/Registration system
- ✅ **Responsive Design** - Works on all devices

## Prerequisites

Before you start, ensure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas) - [Get started here](https://www.mongodb.com/)
- **npm** or **yarn** - Usually comes with Node.js

## Installation Steps

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Setup Backend Environment Variables

Create a `.env` file in the `server` folder:

```bash
cp .env.example .env
```

Edit `.env` and update these values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gogrowth
NODE_ENV=development
JWT_SECRET=your_secret_key_here_change_this
USE_MOCK_DATA=true
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gogrowth
```

### Step 3: Install Frontend Dependencies

```bash
cd client
npm install
```

### Step 4: Setup Frontend Environment Variables

Create a `.env` file in the `client` folder:

```bash
cp .env.example .env
```

The default configuration should work:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Start the Backend Server

```bash
cd server
npm start
```

You should see:
```
✓ Server running on http://localhost:5000
✓ MongoDB connected
```

### Step 6: Start the Frontend (in a new terminal)

```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

## Running in Development Mode

For better development experience with auto-reload:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

## Using Mock Data

To use mock data without MongoDB:

1. Set `USE_MOCK_DATA=true` in `server/.env`
2. The app will run with all your original mock data
3. Changes won't persist (they're stored in memory)

## Switching to Real MongoDB

1. Set `USE_MOCK_DATA=false` in `server/.env`
2. Ensure MongoDB is running
3. Data will persist in the database

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/stats` - Get statistics

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create a resource
- `PUT /api/resources/:id` - Update a resource
- `DELETE /api/resources/:id` - Delete a resource

### Auth
- `POST /api/users/login` - Login
- `POST /api/users/register` - Register
- `GET /api/users/profile` - Get current user (requires auth)

## File Structure Explanation

### Backend Components

**Models** (`server/models/`):
- `Task.js` - Task schema with all properties
- `Resource.js` - Resource schema
- `User.js` - User schema with password hashing

**Controllers** (`server/controllers/`):
- `taskController.js` - Task CRUD operations
- `resourceController.js` - Resource CRUD operations
- `userController.js` - Authentication logic

**Routes** (`server/routes/`):
- `taskRoutes.js` - Task endpoints
- `resourceRoutes.js` - Resource endpoints
- `userRoutes.js` - Auth endpoints

**Middleware** (`server/middleware/`):
- `auth.js` - JWT authentication middleware

### Frontend Components

**Components** (`client/src/components/`):
- `Header.js` - Navigation and theme toggle
- `Statistics.js` - Stats cards and date filter
- `TaskCard.js` - Individual task display
- `TaskModal.js` - Create/Edit task form
- `TaskFilters.js` - Filter panel
- `Loader.js` - Loading spinner
- `Notification.js` - Toast notifications

**Pages** (`client/src/pages/`):
- `Dashboard.js` - Main dashboard page
- `Resources.js` - Resources management page
- `Login.js` - Authentication page

**Hooks** (`client/src/hooks/`):
- `useTasks.js` - Task management logic
- `useResources.js` - Resource management logic
- `useAuth.js` - Authentication logic

**Services** (`client/src/services/`):
- `api.js` - Axios API client with endpoints

## Troubleshooting

### "MongoDB connection refused"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, verify IP whitelist settings

### "CORS error" (Frontend can't reach backend)
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in client `.env`
- Verify CORS middleware in `server.js`

### "Module not found" errors
- Run `npm install` again in both `server` and `client`
- Delete `node_modules` and `package-lock.json`, then reinstall

### Port 3000 or 5000 already in use
```bash
# Find process using port
lsof -i :3000      # On macOS/Linux
netstat -ano | findstr :5000  # On Windows

# Kill process
kill -9 <PID>
```

## Building for Production

### Frontend Build
```bash
cd client
npm run build
```

Creates optimized production build in `client/build/`

### Deploy Backend
- Set environment variables on your hosting platform
- Use process manager like PM2 or Heroku
- Ensure MongoDB is accessible from your server

## Next Steps

1. **Customize branding**: Update app name and colors in CSS variables
2. **Add more features**: Use the component structure as a template
3. **Connect to real data**: Replace mock data with your actual data
4. **Deploy**: Host on Vercel (frontend) + Heroku/AWS (backend)

## Useful Commands

```bash
# Frontend
cd client
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests

# Backend
cd server
npm start          # Start server
npm run dev        # Start with auto-reload
```

## Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

## Support

For issues or questions:
1. Check the browser console (F12)
2. Check server logs in terminal
3. Review environment variables
4. Ensure all dependencies are installed

---

**Your MERN application is ready to use!** 🚀
