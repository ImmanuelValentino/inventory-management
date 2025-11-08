// File: /server/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');

// GET /api/dashboard/summary
// Kita tidak perlu menambah authMiddleware di sini
// karena 'index.js' akan menanganinya
router.get('/summary', getDashboardSummary);

module.exports = router;