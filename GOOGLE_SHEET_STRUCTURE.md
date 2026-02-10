# Google Sheet Structure for GoGrowth

## Sheet 1: "Tasks"

Required columns (in order):

| Column | Name | Example | Type | Notes |
|--------|------|---------|------|-------|
| A | ID | task-1 | Text | Unique identifier |
| B | Title | Build responsive dashboard | Text | Task title |
| C | Description | Create mobile-friendly design | Text | Task details |
| D | Priority | High | Text | Critical / High / Medium / Low |
| E | Status | In progress | Text | Pending / In progress / Completed |
| F | Assigned To | John Doe | Text | Person name |
| G | Client | TechCorp | Text | Client name |
| H | Deadline | 2026-02-14 | Date | YYYY-MM-DD format |
| I | Tags | design,ui,mobile | Text | Comma-separated |
| J | Created At | 2026-01-01 | Date | YYYY-MM-DD format |
| K | Updated At | 2026-02-09 | Date | YYYY-MM-DD format |
| L | (empty) | - | - | Leave empty |

### Example Data (Row 2 onwards):

```
task-1 | Build responsive dashboard | Create a mobile-friendly design | High | In progress | John Doe | TechCorp | 2026-02-14 | design,ui,mobile | 2026-01-01 | 2026-02-09 |
task-2 | Integrate payment gateway | Add Stripe integration | High | Pending | Jane Smith | StartupXYZ | 2026-02-17 | backend,payments | 2026-02-05 | 2026-02-09 |
task-3 | Fix auth bug | JWT token expiration issue | Critical | In progress | Mike Johnson | TechCorp | 2026-02-11 | bugs,security | 2026-02-08 | 2026-02-09 |
task-4 | Write documentation | Document all REST APIs | Medium | Completed | Sarah Wilson | Internal | 2026-02-08 | docs,api | 2026-02-01 | 2026-02-08 |
task-5 | Setup CI/CD | GitHub Actions workflow | High | Pending | Alex Chen | Internal | 2026-02-21 | devops,automation | 2026-02-07 | 2026-02-09 |
```

---

## Sheet 2: "Resources"

Required columns (in order):

| Column | Name | Example | Type | Notes |
|--------|------|---------|------|-------|
| A | ID | resource-1 | Text | Unique identifier |
| B | Title | React Documentation | Text | Resource title |
| C | Description | Official React docs | Text | Resource details |
| D | Category | Learning | Text | Learning / Tools / Services |
| E | Type | Documentation | Text | Article / Tutorial / Video / Tool |
| F | URL | https://react.dev | Text | Link to resource |
| G | Status | Active | Text | Active / Archived / Deprecated |
| H | Tags | react,frontend,js | Text | Comma-separated |

### Example Data (Row 2 onwards):

```
resource-1 | React Documentation | Official React docs for learning | Learning | Documentation | https://react.dev | Active | react,frontend,javascript |
resource-2 | MongoDB Atlas | Cloud database for MongoDB | Tools | Service | https://www.mongodb.com/cloud | Active | database,mongodb,backend |
resource-3 | Tailwind CSS | Utility-first CSS framework | Learning | Documentation | https://tailwindcss.com | Active | tailwind,css,styling |
resource-4 | Express.js Best Practices | Guide to secure APIs | Learning | Article | https://expressjs.com/best-practice | Active | express,api,backend |
resource-5 | Figma Design Tool | Collaborative design platform | Tools | Software | https://www.figma.com | Active | design,ui,collaboration |
resource-6 | GitHub Actions | CI/CD automation platform | Tools | Service | https://github.com/features/actions | Active | devops,automation |
resource-7 | JavaScript Async/Await | Understanding async patterns | Learning | Tutorial | https://javascript.info/async-await | Active | javascript,async,learning |
resource-8 | Google Sheets API | Integrate sheets with apps | Tools | API | https://developers.google.com/sheets/api | Active | google,sheets,api |
```

---

## Creating the Sheet Structure

### Option 1: Manual (Recommended)
1. Create new Google Sheet
2. Rename first sheet to "Tasks"
3. Add column headers (A-L) as shown above
4. Add your data starting from row 2
5. Create second sheet named "Resources"
6. Add column headers (A-H) as shown above
7. Add your data starting from row 2

### Option 2: Use Template
Copy this to your Google Sheet to set up quickly:

**Tasks sheet, Row 1 (Headers):**
```
ID | Title | Description | Priority | Status | Assigned To | Client | Deadline | Tags | Created At | Updated At | 
```

**Resources sheet, Row 1 (Headers):**
```
ID | Title | Description | Category | Type | URL | Status | Tags
```

---

## Important Notes

✅ **Sheet Names**: Must be exactly "Tasks" and "Resources" (case-sensitive)

✅ **Column Order**: Must match the order above (A, B, C, etc.)

✅ **Headers in Row 1**: Leave row 1 for headers, start data in row 2

✅ **Date Format**: Use YYYY-MM-DD (e.g., 2026-02-14)

✅ **Tags**: Use comma-separated values (e.g., "design,ui,mobile")

✅ **Empty Column**: Column L in Tasks sheet should be empty (for data safety)

⚠️ **No Extra Columns**: Don't add columns beyond what's specified (it will break parsing)

---

## Share Your Sheet

1. Open your Google Sheet
2. Click Share (top right)
3. Add email addresses of users who need access
4. Set permissions to "Editor" (for write access) or "Viewer" (read-only)

---

## Google Sheet URL Reference

Your Sheet URL looks like:
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ456def/edit#gid=0
                                        ↑ THIS IS YOUR SHEET ID ↑
```

Copy the Sheet ID part and add to server/.env:
```
GOOGLE_SHEET_ID=1ABC123XYZ456def
```

---

## Testing Your Setup

1. Make sure GOOGLE_SHEET_ID and GOOGLE_API_KEY are in server/.env
2. Restart backend: `npm start` (in server/)
3. Open: http://localhost:3000
4. Check browser console (F12) for errors
5. If no data shows, verify:
   - Sheet names are exactly "Tasks" and "Resources"
   - Data starts in row 2 (row 1 is headers)
   - Column order matches above
   - API credentials are correct

---

That's it! Your Google Sheet is now your database! 🎉
