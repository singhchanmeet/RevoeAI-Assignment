// models/Table.js
const mongoose = require('mongoose');

const ColumnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'date'],
    default: 'text',
  },
  // If true, this column is from the Google Sheet. If false, it's only on the dashboard.
  isSourceColumn: {
    type: Boolean,
    default: true,
  },
});

const TableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a table name'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sheetUrl: {
      type: String,
      required: [true, 'Please add a Google Sheet URL'],
    },
    columns: [ColumnSchema],
    // Store the last time we polled for updates
    lastPolled: {
      type: Date,
      default: Date.now,
    },
    // For any dynamic columns added in the dashboard (not in the Google Sheet)
    dynamicColumns: [ColumnSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Table', TableSchema);