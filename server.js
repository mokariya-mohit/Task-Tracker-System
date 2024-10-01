const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db'); // Import database connection function
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config(); // For loading environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Firebase Admin initialization
admin.initializeApp({
    credential: admin.credential.cert(path.join(__dirname, 'config/task-management-f903b-firebase-adminsdk-azl3s-1191874f9f.json')),
});

// Connect to MongoDB
connectDB(); // Call to connect to the database

// Middleware and Routes
app.use(express.json());

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});

module.exports = { io }; // Export the Socket.io instance
