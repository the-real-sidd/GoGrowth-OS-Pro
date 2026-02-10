require('dotenv').config();

try {
  const GoogleSheetsService = require('./services/googleSheetsService');
  console.log('✓ GoogleSheetsService loaded successfully');
  console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
  console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '***SET***' : '***NOT SET***');
} catch (err) {
  console.error('✗ Error loading GoogleSheetsService:', err.message);
}
