# GoGrowth OS Pro - Running Without Database ✓

## Quick Start (Mock Data Mode)

Your app is now configured to run **without MongoDB** using mock data. Perfect for development and testing!

### Start Backend Server

```bash
cd server
npm start
```

Expected output:
```
✓ Using mock data mode
✓ Server running on http://localhost:5000
```

### Start Frontend (In New Terminal)

```bash
cd client
npm start
```

The app will open at `http://localhost:3000` with:
- ✅ **No login required** - Auto-logged in as "Demo User"
- ✅ **Mock task data** - Sample tasks pre-loaded
- ✅ **Mock resource data** - Sample resources available
- ✅ **All features working** - Filtering, search, create/edit/delete
- ✅ **Tailwind CSS** - Ready for custom styling

---

## Current Setup

### Frontend (React)
- **Location:** `/client`
- **Framework:** React 18
- **Styling:** Tailwind CSS + CSS Variables
- **Status:** ✅ Ready to run
- **Features:** Dashboard, Resources, Settings, Dark Mode

### Backend (Express)
- **Location:** `/server`
- **Framework:** Express.js
- **Data Mode:** Mock Data (USE_MOCK_DATA=true)
- **Status:** ✅ Ready to run
- **Features:** Task Routes, Resource Routes, User Routes

### Database
- **Status:** 🔌 Not Required (Mock mode)
- **When Needed:** Later, enable with real MongoDB

---

## Switching to Real Database

When you're ready to use MongoDB:

### 1. Install & Start MongoDB
```bash
# Windows: Download from mongodb.com or use WSL
# macOS: brew install mongodb-community && brew services start mongodb-community
# Linux: sudo apt-get install mongodb && sudo systemctl start mongod
```

### 2. Update `.env` Files

**server/.env:**
```
MONGODB_URI=mongodb://localhost:27017/gogrowth
USE_MOCK_DATA=false
JWT_SECRET=change_this_in_production
```

**client/.env:**
```
REACT_APP_USE_MOCK_DATA=false
```

### 3. Uncomment Authentication in App.js

Find these lines in `client/src/App.js` and uncomment them:
```javascript
// Uncomment when DB is ready:
// import { useAuth } from './hooks/useAuth';
// const { user, login, logout, getCurrentUser } = useAuth();

// And add back the login check:
// if (!user) return <Login onLoginSuccess={() => setLoading(false)} />;
```

### 4. Restart Servers
```bash
npm start  # in both server/ and client/
```

---

## File Structure

```
GoGrowth-OS-Pro/
├── server/
│   ├── .env                 ← Database config
│   ├── server.js            ← Main server file
│   ├── models/              ← MongoDB models
│   ├── controllers/         ← Business logic
│   ├── routes/              ← API routes
│   ├── middleware/          ← Auth middleware
│   └── mockData.js          ← Mock data store
│
├── client/
│   ├── .env                 ← Frontend config
│   ├── src/
│   │   ├── App.js           ← Main React component
│   │   ├── index.css        ← Tailwind + CSS vars
│   │   ├── pages/           ← React pages
│   │   ├── components/      ← Reusable components
│   │   ├── hooks/           ← Custom hooks
│   │   ├── services/        ← API services
│   │   └── assets/          ← Images, icons
│   ├── tailwind.config.js   ← Tailwind config
│   ├── postcss.config.js    ← PostCSS config
│   └── package.json
│
└── documentation/           ← Setup guides
```

---

## Mock Data Features

The app comes with mock data for:
- 📋 **10+ Sample Tasks** - Different priorities, statuses, dates
- 📚 **5+ Sample Resources** - Links, tutorials, tools
- 👤 **Demo User Profile** - Pre-authenticated user

All mock data is stored in `server/mockData.js` and can be customized.

---

## Tailwind CSS

Ready to customize the UI with Tailwind:

### Available Tailwind Classes
- Colors: `text-primary`, `bg-success`, `border-danger`, `text-warning`
- Spacing: `p-4`, `m-2`, `gap-6`
- Layout: `flex`, `grid`, `container`

### Example Component Usage
```jsx
<div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
  <h2 className="text-2xl font-bold text-primary">Hello</h2>
  <button className="bg-primary text-white px-4 py-2 rounded hover:opacity-90">
    Click me
  </button>
</div>
```

### Build with Tailwind
When you run `npm start`, Tailwind CSS is automatically built and compiled.

---

## Troubleshooting

### App won't start?
```bash
# Clear node modules and reinstall
rm -r server/node_modules client/node_modules
cd server && npm install
cd ../client && npm install
```

### Dashboard shows no data?
- Check that both servers are running
- Backend: http://localhost:5000/api/health
- Look for "Mock data mode" in server console

### Dark mode not working?
- Go to Settings → Toggle Dark Mode
- Requires React context to be working

### Tailwind classes not applying?
- Restart `npm start` in client directory
- Tailwind rebuilds automatically

---

## Next Steps

1. ✅ **Run the app** with `npm start` in both directories
2. 🎨 **Customize UI** with Tailwind CSS
3. 📝 **Add new features** to components
4. 🗄️ **Setup MongoDB** when ready
5. 🔐 **Re-enable authentication** for production

---

## Quick Commands

```bash
# From project root

# Start both servers (open 2 terminals)
cd server && npm start
cd client && npm start

# Check backend health
curl http://localhost:5000/api/health

# Clear cache
npm cache clean --force

# Reset everything
rm -r server/node_modules client/node_modules
rm server/package-lock.json client/package-lock.json
npm install --prefix server
npm install --prefix client
```

---

## Support

For issues, check:
- 📖 `/documentation` folder for detailed guides
- 🔧 Server console for backend errors
- 🌐 Browser console (F12) for frontend errors
- 📝 Component files in `client/src/components/`

---

**Happy coding! 🚀**

Your app is ready to use. Start the servers and begin building! 🎉
