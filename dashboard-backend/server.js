// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
require('./config/db')();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);

// Error handler
app.use(errorHandler);

// Socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('joinTable', (tableId) => {
    socket.join(tableId);
    console.log(`Client joined table: ${tableId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Export socket.io instance for use in other files
module.exports.io = io;

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});