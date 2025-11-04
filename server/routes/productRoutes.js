// File: /server/routes/productRoutes.js

const express = require('express');
const router = express.Router();

// Impor fungsi controller kita
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

// Definisikan rute-rute CRUD

// GET /api/products
router.get('/', getAllProducts);

// POST /api/products
router.post('/', createProduct);

// GET /api/products/:id
router.get('/:id', getProductById);

// PUT /api/products/:id
router.put('/:id', updateProduct);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

module.exports = router;