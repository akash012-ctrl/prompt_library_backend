// routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin'); // Assuming you have an admin middleware

const router = express.Router();

// Admin-only route: Get all users
router.get('/', [authMiddleware, adminMiddleware], getAllUsers);

// Admin-only route: Get a single user by ID
router.get('/:id', [authMiddleware, adminMiddleware], getUserById);

// Admin-only route: Update a user by ID
router.put('/:id', [authMiddleware, adminMiddleware], updateUser);

// Admin-only route: Delete a user by ID
router.delete('/:id', [authMiddleware, adminMiddleware], deleteUser);

module.exports = router;