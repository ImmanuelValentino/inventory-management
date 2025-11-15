// File: /server/routes/warehouseRoutes.js (BARU)

const express = require('express');
const router = express.Router();
// 1. Impor middleware admin
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware');

// 2. Impor controller
const {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
} = require('../controllers/warehouseController'); // (Pastikan ejaan controller ini benar)

// Rute GET (Membaca) - Boleh untuk semua user yang login
// Ini agar staff_gudang bisa melihat daftar gudang di dropdown
router.get('/', getAllWarehouses);
router.get('/:id', getWarehouseById);

// Rute TULIS (Write) - HANYA ADMIN
router.post('/', adminOnlyMiddleware, createWarehouse);
router.put('/:id', adminOnlyMiddleware, updateWarehouse);
router.delete('/:id', adminOnlyMiddleware, deleteWarehouse);

module.exports = router;