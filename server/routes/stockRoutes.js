// File: /server/routes/stockRoutes.js

const express = require('express');
const router = express.Router();
// 1. Update impor
const {
    handleInbound,
    getStockLevels,
    handleOutbound,
    handleTransfer,
    handleAdjustment,
    getStockMovements // <-- Tambahkan ini
} = require('../controllers/stockController');

// ... (rute /inbound, /levels, /outbound, /transfer, /adjustment) ...
router.post('/inbound', handleInbound);
router.get('/levels', getStockLevels);
router.post('/outbound', handleOutbound);
router.post('/transfer', handleTransfer);
router.post('/adjustment', handleAdjustment);

// 2. TAMBAHKAN RUTE BARU DI BAWAH
// GET /api/stock/movements
router.get('/movements', getStockMovements);

module.exports = router;