// File: /server/routes/productRoutes.js (BARU)

const express = require('express');
const router = express.Router();
// 1. IMPOR adminOnlyMiddleware DI SINI
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware');

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

// Rute GET (Membaca) - Boleh untuk semua user yang login
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rute TULIS (Write) - HANYA ADMIN
// 2. Terapkan adminOnlyMiddleware di sini
router.post('/', adminOnlyMiddleware, createProduct);
router.put('/:id', adminOnlyMiddleware, updateProduct);
router.delete('/:id', adminOnlyMiddleware, deleteProduct);

module.exports = router;