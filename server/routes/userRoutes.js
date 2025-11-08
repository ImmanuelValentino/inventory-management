// File: /server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');

// Perhatikan: Kita tidak perlu 'authMiddleware' atau 'adminOnlyMiddleware' di sini
// karena kita akan menerapkannya di file index.js

// GET /api/users
router.get('/', getAllUsers);

// PUT /api/users/:id/role
router.put('/:id/role', updateUserRole);

module.exports = router;