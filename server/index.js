// File: /server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabaseClient');

// --- 1. IMPOR SEMUA MIDDLEWARE & RUTE ---
const authMiddleware = require('./middleware/authMiddleware');
const adminOnlyMiddleware = require('./middleware/adminOnlyMiddleware');

const productRoutes = require('./routes/productRoutes'); // <--- TAMBAHKAN INI
const supplierRoutes = require('./routes/supplierRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const locationRoutes = require('./routes/locationRoutes.');
const stockRoutes = require('./routes/stockRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // <-- 1. IMPOR INI
const userRoutes = require('./routes/userRoutes'); // <-- 1. IMPOR INI


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- 2. DEFISIKAN RUTE ---

// Rute Publik (Tidak perlu login)
app.use('/api/auth', authRoutes);
app.get('/api/test', (req, res) => {
    res.json({ message: 'API berjalan!' });
});

// Rute Admin Only (Harus login DAN role 'admin')
// Kita jalankan authMiddleware, LALU adminOnlyMiddleware
app.use('/api/products', [authMiddleware, adminOnlyMiddleware], productRoutes);
app.use('/api/suppliers', [authMiddleware, adminOnlyMiddleware], supplierRoutes);
app.use('/api/warehouses', [authMiddleware, adminOnlyMiddleware], warehouseRoutes);
app.use('/api/locations', [authMiddleware, adminOnlyMiddleware], locationRoutes);
app.use('/api/users', [authMiddleware, adminOnlyMiddleware], userRoutes); // <-- 2. TAMBAHKAN INI

// Rute Transaksi (Hanya perlu login, 'staff_gudang' BISA)
app.use('/api/stock', authMiddleware, stockRoutes);
// Jalankan Server

app.use('/api/dashboard', authMiddleware, dashboardRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
});