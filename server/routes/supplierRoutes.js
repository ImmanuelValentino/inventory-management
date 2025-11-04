// File: /server/routes/supplierRoutes.js

const express = require('express');
const router = express.Router();

// Impor fungsi controller
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} = require('../controllers/supplierController');

// Definisikan rute-rute CRUD
router.get('/', getAllSuppliers);
router.post('/', createSupplier);
router.get('/:id', getSupplierById);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;