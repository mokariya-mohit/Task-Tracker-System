const express = require('express');
const { registerUser, loginUser, getAllUsers, assignRole } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

const router = express.Router();

// User Registration
router.post('/register', registerUser);
// User Login
router.post('/login', loginUser);
// Get all users (Admin only)
router.get('/users', authMiddleware, roleMiddleware(['admin']), getAllUsers);

// Assign role to a user (Admin only)
router.put('/assign-role/:id', authMiddleware, roleMiddleware(['admin']), assignRole);

module.exports = router;
