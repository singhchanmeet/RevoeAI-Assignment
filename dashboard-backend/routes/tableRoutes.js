// routes/tableRoutes.js
const express = require('express');
const { 
  createTable, 
  getTables, 
  getTable, 
  getTableData, 
  addColumn, 
  deleteTable 
} = require('../controllers/tableController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getTables)
  .post(createTable);

router.route('/:id')
  .get(getTable)
  .delete(deleteTable);

router.get('/:id/data', getTableData);
router.post('/:id/columns', addColumn);

module.exports = router;