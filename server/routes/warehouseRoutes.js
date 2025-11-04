// File: /server/routes/warehouseRoutes.js

const express = require('express');
const router = express.Router();

const {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
} = require('../controllers/warehouseController');

// Definisikan rute-rute CRUD
router.get('/', getAllWarehouses);
router.post('/', createWarehouse);
router.get('/:id', getWarehouseById);
router.put('/:id', updateWarehouse);
router.delete('/:id', deleteWarehouse);

module.exports = router;