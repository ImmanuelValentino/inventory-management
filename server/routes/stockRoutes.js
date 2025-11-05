// File: /server/routes/stockRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // <-- 1. IMPOR
const {
    handleInbound,
    getStockLevels,
    handleOutbound,
    handleTransfer,
    handleAdjustment,
    getStockMovements
} = require('../controllers/stockController');

// Terapkan middleware ke SEMUA rute transaksi
router.post('/inbound', authMiddleware, handleInbound);
router.post('/outbound', authMiddleware, handleOutbound);
router.post('/transfer', authMiddleware, handleTransfer);
router.post('/adjustment', authMiddleware, handleAdjustment);

// Laporan juga kita amankan
router.get('/levels', authMiddleware, getStockLevels);
router.get('/movements', authMiddleware, getStockMovements);

module.exports = router;