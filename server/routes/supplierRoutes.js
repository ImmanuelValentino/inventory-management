// File: /server/routes/supplierRoutes.js (BARU)
const express = require('express');
const router = express.Router();
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware'); // <-- Impor
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} = require('../controllers/supplierController');

// Rute GET - Boleh untuk semua
router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);

// Rute TULIS - Hanya Admin
router.post('/', adminOnlyMiddleware, createSupplier);
router.put('/:id', adminOnlyMiddleware, updateSupplier);
router.delete('/:id', adminOnlyMiddleware, deleteSupplier);

module.exports = router;