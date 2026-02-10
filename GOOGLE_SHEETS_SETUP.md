# Google Sheets as Backend - Setup Guide

## Quick Setup (5 minutes)

Your GoGrowth app now pulls data directly from Google Sheets instead of MongoDB!

### STEP 1: Get Your Google Sheets API Credentials

1. Go to: https://console.cloud.google.com
2. Create a new project (name: "GoGrowth Dashboard")
3. Enable **Google Sheets API** (Search → Enable API)
4. Create **API Key**:
   - Click "Create Credentials" → API Key
   - Copy your API Key

### STEP 2: Find Your Sheet ID

Get your Google Sheet's ID from the URL:
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ456def/edit#gid=0
                                        ↑ COPY THIS PART ↑
```

### STEP 3: Create Sheet Structure

Your Google Sheet must have these columns:

**Sheet 1: "Tasks"**
```
A: ID              | B: Title        | C: Description   | D: Priority
E: Status          | F: Assigned To  | G: Client        | H: Deadline
I: Tags            | J: Created At   | K: Updated At    | L: (empty)
```

**Sheet 2: "Resources"**
```
A: ID              | B: Title        | C: Description   | D: Category
E: Type            | F: URL          | G: Status        | H: Tags
```

### STEP 4: Add Sample Data to Sheet

**Tasks Sheet - Add this row (starting row 2):**
```
task-1 | Build responsive dashboard | Create mobile-friendly design | High | In progress | John Doe | TechCorp | 2026-02-14 | design,ui | 2026-01-01 | 2026-02-09 |
```

**Resources Sheet - Add this row (starting row 2):**
```
resource-1 | React Documentation | Official React docs | Learning | Documentation | https://react.dev | Active | react,frontend
```

### STEP 5: Update Environment File

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gogrowth
JWT_SECRET=your_jwt_secret_key_here_change_in_production
USE_MOCK_DATA=false
NODE_ENV=development

# Google Sheets Configuration
GOOGLE_SHEET_ID=YOUR_SHEET_ID_HERE
GOOGLE_API_KEY=YOUR_API_KEY_HERE
```

Replace:
- `YOUR_SHEET_ID_HERE` - Your Google Sheet ID from Step 2
- `YOUR_API_KEY_HERE` - Your API Key from Step 1

### STEP 6: Install Google API Library

Run this in the `server` directory:
```bash
npm install googleapis
```

### STEP 7: Start Your Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### STEP 8: Open Dashboard

Visit: http://localhost:3000

You should see your tasks and resources from Google Sheets! 🎉

---

## Important Notes

1. **Sheet Name Must Match**: The sheets MUST be named exactly "Tasks" and "Resources" (case-sensitive)
2. **API Key**: Your API Key is public - that's fine for this use case. For production, use OAuth
3. **Columns**: Add all columns even if they're unused (helps with data parsing)
4. **Read-Only by Default**: API Key can read Google Sheets. For write operations, implement Service Account authentication
5. **Live Updates**: Changes in Google Sheets appear immediately in your app

---

## Using Google Sheets as Your Database

### Add a Task
Go to your Google Sheet → Tasks sheet → Add a new row with:
- Unique ID (e.g., `task-2`)
- Title, Description, Priority, Status, etc.

The app will automatically show it on the dashboard!

### Update a Task
Edit the row in Google Sheets → Refresh the app (F5)

### Delete a Task
Delete the row from Google Sheets → Refresh the app

---

## Common Issues

**"Failed to fetch tasks from Google Sheets"**
- Check GOOGLE_SHEET_ID and GOOGLE_API_KEY in .env
- Verify API Key is valid in Google Cloud Console
- Make sure sheet names are "Tasks" and "Resources"

**"No data showing"**
- Make sure you added data starting from row 2 (row 1 is headers)
- Check column order matches the structure above
- Open browser console (F12) to see error messages

**"App shows mock data, not Google Sheets"**
- Verify GOOGLE_SHEET_ID and GOOGLE_API_KEY are set in .env
- Restart both servers
- Clear browser cache (Ctrl+Shift+Delete)

---

## Advanced: Writing to Google Sheets

To enable create/update/delete operations to Google Sheets, you'll need:

1. Service Account credentials (instead of API Key)
2. Share the sheet with the Service Account email
3. Update `googleSheetsService.js` to use ServiceAccountAuth

For now, you can:
- View and read from Google Sheets ✅
- Manually add/edit/delete rows in Google Sheets
- See changes immediately in the app ✅

---

## Need Help?

1. Check Server logs (Terminal 1) for error messages
2. Open browser console (F12) for frontend errors
3. Verify credentials in `.env` file
4. Test API Key at: https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}?key={API_KEY}

---

## What's Next?

✅ Your app now uses Google Sheets as the backend
✅ No MongoDB needed
✅ Real-time data sync
✅ Easy to manage data (just edit the sheet!)

Enjoy! 🚀
