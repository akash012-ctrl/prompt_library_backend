// routes/reportRoutes.js
const express = require('express');
const { getAllReports, createReport, deleteReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Admin-only route: Get all reports
router.get('/', [authMiddleware, adminMiddleware], getAllReports);

// Public route: Create a new report
router.post('/', authMiddleware, createReport);

// Admin-only route: Delete a report by ID
router.delete('/:id', [authMiddleware, adminMiddleware], deleteReport);

module.exports = router;