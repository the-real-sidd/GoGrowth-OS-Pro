# QUICK SETUP GUIDE - GoGrowth Dashboard

## ✅ TO USE WITH MOCK DATA (WORKS NOW!)

1. Open `index.html` in your browser
2. Done! Everything works immediately

---

## 🔧 TO CONNECT TO GOOGLE SHEETS (15 min setup)

### STEP 1: Get Google Cloud Credentials

Go to: https://console.cloud.google.com

1. Create new project: "GoGrowth Dashboard"
2. Enable **Google Sheets API**
3. Create **API Key** → Copy it
4. Create **OAuth Client ID** (Web application)
   - Add origin: `http://localhost:8000`
   - Add origin: `file://`
   - Copy the Client ID

### STEP 2: Get Your Sheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ456/edit
                                        ↑ COPY THIS PART
```

### STEP 3: Update config.js

Open `js/config.js` and change:

```javascript
Line ~10: GOOGLE_CLIENT_ID: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
Line ~13: GOOGLE_API_KEY: 'YOUR_ACTUAL_API_KEY',
Line ~23: SPREADSHEET_ID: 'YOUR_ACTUAL_SHEET_ID',
Line ~33: USE_MOCK_DATA: false,  // Change true to false
```

### STEP 4: Enable Google API

Open `index.html` and uncomment line 17:

```html
FROM: <!-- <script src="https://apis.google.com/js/api.js"></script> -->
TO:   <script src="https://apis.google.com/js/api.js"></script>
```

### STEP 5: Share Your Sheet

1. Open your Google Sheet
2. Click Share
3. Add users who will access the dashboard
4. Set to "Editor" or "Viewer"

### STEP 6: Test

1. Open `index.html`
2. Sign in with Google when prompted
3. You're live! 🎉

---

## 📁 FILE LOCATIONS

```
ADD YOUR CREDENTIALS HERE:
→ js/config.js (lines 10-33)

UNCOMMENT GOOGLE API HERE:
→ index.html (line 17)

OPEN THIS TO START:
→ index.html
```

---

## 🆘 TROUBLESHOOTING

**Dashboard not loading?**
- Check all files are in correct folders
- Open browser console (F12) for errors

**Can't connect to Google Sheets?**
- Verify credentials in config.js
- Check Google API script is uncommented
- Make sure USE_MOCK_DATA is false
- Verify Google Sheets API is enabled in Cloud Console

**Access denied?**
- Check sheet is shared with your Google account
- Verify OAuth client origins include your URL

---

## 📞 NEED HELP?

1. Check README.md for detailed instructions
2. Check browser console (Press F12) for errors
3. Verify all steps in this checklist

---

**Current Mode:** MOCK DATA (Safe to test)  
**To Go Live:** Follow steps above (15 min)  
**Support:** See README.md for full documentation
