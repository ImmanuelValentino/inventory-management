// File: /server/routes/locationRoutes.js

const express = require('express');
const router = express.Router();

const {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
} = require('../controllers/locationController');

// Definisikan rute-rute CRUD
router.get('/', getAllLocations);
router.post('/', createLocation);
router.get('/:id', getLocationById);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;