const express = require('express');
const { createTask, updateTask, deleteTask, getUserTasks, getAllTasks } = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { sendPushNotification } = require('../services/notificationService.js'); // Import your push notification function

const router = express.Router();
const io = require('../server').io; // Import Socket.io instance from server.js

// Create new task (User)
router.post('/', async (req, res) => {
    try {
        const task = await createTask(req, res);

        // Emit real-time event
        io.emit('taskCreated', task);

        // Send push notification (if applicable)
        sendPushNotification({
            title: 'New Task Created',
            body: `A new task was created: ${task.description}`,
            userId: req.user.id
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update task (User or Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await updateTask(req, res);

        // Emit real-time event
        io.emit('taskUpdated', task);

        // Send push notification (if applicable)
        sendPushNotification({
            title: 'Task Updated',
            body: `Task ${task.description} has been updated.`,
            userId: req.user.id
        });

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete task (User or Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await deleteTask(req, res);

        // Emit real-time event
        io.emit('taskDeleted', task);

        // Send push notification (if applicable)
        sendPushNotification({
            title: 'Task Deleted',
            body: `Task ${task.description} has been deleted.`,
            userId: req.user.id
        });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all tasks for the logged-in user (User)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const tasks = await getUserTasks(req, res);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all tasks (Admin)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const tasks = await getAllTasks(req, res);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
