const Task = require('../models/task');
const { sendNotification } = require('../server'); // Import the sendNotification function
const io = require('../server').io; // Import the Socket.io instance

// Create a new task
const createTask = async (req, res) => {
    const { description, category } = req.body;
    try {
        const task = new Task({
            description,
            category,
            createdBy: req.user.id,
        });
        await task.save();

        // Notify the user who created the task
        await sendNotification(req.user.token, 'New Task Created', `Task "${description}" has been created.`);

        // Emit real-time task creation
        io.emit('taskUpdate', { type: 'create', task });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const { description, category, status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        task.description = description || task.description;
        task.category = category || task.category;
        task.status = status || task.status;
        await task.save();

        // Notify users involved in the task
        await sendNotification(task.createdBy.token, 'Task Updated', `Task "${description}" has been updated.`);

        // Emit real-time task update
        io.emit('taskUpdate', { type: 'update', task });

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await task.remove();

        // Notify users involved in the task
        await sendNotification(task.createdBy.token, 'Task Deleted', `Task "${task.description}" has been deleted.`);

        // Emit real-time task deletion
        io.emit('taskUpdate', { type: 'delete', task: { id: req.params.id } });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get tasks for the logged-in user
const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tasks (Admin)
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, updateTask, deleteTask, getUserTasks, getAllTasks };
