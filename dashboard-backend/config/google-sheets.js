// config/google-sheets.js
const { google } = require('googleapis');

// Create auth client
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create sheets client
const sheets = google.sheets({ version: 'v4', auth });

/**
 * Extract spreadsheet ID from Google Sheets URL
 * @param {string} url - Google Sheets URL
 * @returns {string} - Spreadsheet ID
 */
const getSpreadsheetId = (url) => {
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Get data from Google Sheet
 * @param {string} sheetUrl - Google Sheets URL
 * @param {array} columns - Array of column objects with names
 * @returns {array} - Array of row objects
 */
const getSheetData = async (sheetUrl, columns) => {
  try {
    const spreadsheetId = getSpreadsheetId(sheetUrl);
    
    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheet URL');
    }
    
    // Get spreadsheet info to find the first sheet name
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    // console.log(spreadsheet);
    const sheetName = spreadsheet.data.sheets[0].properties.title;
    
    // Get header row and data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z`,
    });
    // console.log(response);
    const rows = response.data.values || [];
    console.log(rows);
    if (rows.length === 0) {
      return [];
    }
    
    // Convert to array of objects
    const data = [];
    
    // Skip the header row and map to objects
    for (let i = 1; i < rows.length; i++) {
      const rowData = {};
      
      // Map each column to its corresponding value
      columns.forEach((column, index) => {
        if (index < rows[i].length) {
          // Convert to date objects if the column type is date
          if (column.type === 'date' && rows[i][index]) {
            try {
              rowData[column.name] = new Date(rows[i][index]);
            } catch (e) {
              rowData[column.name] = rows[i][index];
            }
          } else {
            rowData[column.name] = rows[i][index];
          }
        } else {
          rowData[column.name] = '';
        }
      });
      
      data.push(rowData);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    throw error;
  }
};

/**
 * Setup a webhook to watch for changes in a Google Sheet
 * @param {string} sheetUrl - Google Sheets URL
 * @param {function} callback - Function to call when changes are detected
 */
const watchSheet = async (sheetUrl, tableId) => {
  try {
    const spreadsheetId = getSpreadsheetId(sheetUrl);
    
    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheet URL');
    }
    
    // Instead of webhooks, we'll use periodic polling for simplicity
    const pollingInterval = 10000; // 10 seconds
    
    // Store the interval ID so we can clear it later if needed
    const intervalId = setInterval(async () => {
      try {
        // Get the table from database to get the latest columns
        const Table = require('../models/Table');
        const table = await Table.findById(tableId);
        
        if (!table) {
          clearInterval(intervalId);
          return;
        }
        
        // Fetch the latest data
        const data = await getSheetData(sheetUrl, table.columns);
        
        // Emit the updated data to all clients subscribed to this table
        const { io } = require('../server');
        io.to(tableId).emit('tableDataUpdated', data);
        
        // Update last polled timestamp
        await Table.findByIdAndUpdate(tableId, {
          lastPolled: new Date()
        });
      } catch (error) {
        console.error('Error polling Google Sheet:', error);
      }
    }, pollingInterval);
    
    // Store the interval ID in a global map for cleanup
    if (!global.pollingIntervals) {
      global.pollingIntervals = new Map();
    }
    
    // Clear existing interval if it exists
    if (global.pollingIntervals.has(tableId)) {
      clearInterval(global.pollingIntervals.get(tableId));
    }
    
    global.pollingIntervals.set(tableId, intervalId);
    
    return intervalId;
  } catch (error) {
    console.error('Error setting up sheet watcher:', error);
    throw error;
  }
};

module.exports = {
  getSheetData,
  watchSheet,
};