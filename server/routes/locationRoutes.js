// File: /server/routes/locationRoutes.js (BARU)

const express = require('express');
const router = express.Router();
// 1. Impor middleware admin
const adminOnlyMiddleware = require('../middleware/adminOnlyMiddleware');

// 2. Impor controller (sesuai ejaan Anda)
const {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
} = require('../controllers/locationController'); // (Pastikan ejaan controller ini benar)

// Rute GET (Membaca) - Boleh untuk semua user yang login
// Ini agar staff_gudang bisa melihat daftar lokasi di dropdown
router.get('/', getAllLocations);
router.get('/:id', getLocationById);

// Rute TULIS (Write) - HANYA ADMIN
router.post('/', adminOnlyMiddleware, createLocation);
router.put('/:id', adminOnlyMiddleware, updateLocation);
router.delete('/:id', adminOnlyMiddleware, deleteLocation);

module.exports = router;