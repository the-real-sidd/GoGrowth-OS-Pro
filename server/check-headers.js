require('dotenv').config();
const { google } = require('googleapis');

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY
});

async function getHeaders() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${process.env.TASKS_SHEET_NAME || 'All'}!A1:Z1`,
    });

    const headers = response.data.values[0] || [];
    console.log('Column Headers in your Google Sheet:');
    headers.forEach((header, index) => {
      console.log(`Column ${String.fromCharCode(65 + index)}: ${header}`);
    });

    // Also show first few rows
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${process.env.TASKS_SHEET_NAME || 'All'}!A1:Z5`,
    });

    console.log('\n\nFirst few rows:');
    dataResponse.data.values.forEach((row, idx) => {
      console.log(`Row ${idx}:`, row.slice(0, 10).join(' | '));
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getHeaders();
