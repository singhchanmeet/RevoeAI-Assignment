// controllers/tableController.js
const Table = require('../models/Table');
const { getSheetData, watchSheet } = require('../config/google-sheets');

// @desc    Create a new table
// @route   POST /api/tables
// @access  Private
exports.createTable = async (req, res) => {
  try {
    const { name, sheetUrl, columns } = req.body;

    // Create table
    const table = await Table.create({
      name,
      sheetUrl,
      user: req.user._id,
      columns: columns.map(column => ({
        ...column,
        isSourceColumn: true,
      })),
    });

    // Start watching the sheet for changes
    watchSheet(sheetUrl, table._id);

    res.status(201).json({
      success: true,
      table,
    });
  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tables for current user
// @route   GET /api/tables
// @access  Private
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ user: req.user._id });

    res.json({
      success: true,
      tables,
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single table
// @route   GET /api/tables/:id
// @access  Private
exports.getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if the table belongs to the current user
    if (table.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this table' });
    }

    res.json({
      success: true,
      table,
    });
  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get table data from Google Sheets
// @route   GET /api/tables/:id/data
// @access  Private
exports.getTableData = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if the table belongs to the current user
    if (table.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this table' });
    }

    // Get data from Google Sheets
    const data = await getSheetData(table.sheetUrl, table.columns);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get table data error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new dynamic column to a table
// @route   POST /api/tables/:id/columns
// @access  Private
exports.addColumn = async (req, res) => {
  try {
    const { name, type } = req.body;

    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if the table belongs to the current user
    if (table.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this table' });
    }

    // Check if column with same name already exists
    const columnExists = table.columns.some(col => col.name === name) || 
                         table.dynamicColumns.some(col => col.name === name);

    if (columnExists) {
      return res.status(400).json({ message: 'Column with this name already exists' });
    }

    // Add the new dynamic column
    const newColumn = {
      name,
      type: type || 'text',
      isSourceColumn: false,
    };

    table.dynamicColumns.push(newColumn);
    await table.save();

    // Return all columns (both source and dynamic)
    const allColumns = [...table.columns, ...table.dynamicColumns];

    res.status(201).json({
      success: true,
      message: 'Column added successfully',
      columns: allColumns,
    });
  } catch (error) {
    console.error('Add column error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if the table belongs to the current user
    if (table.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this table' });
    }

    // Stop watching the sheet for changes
    if (global.pollingIntervals && global.pollingIntervals.has(table._id.toString())) {
      clearInterval(global.pollingIntervals.get(table._id.toString()));
      global.pollingIntervals.delete(table._id.toString());
    }

    await table.remove();

    res.json({
      success: true,
      message: 'Table removed',
    });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ message: error.message });
  }
};