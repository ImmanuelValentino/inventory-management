// File: /server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabaseClient');

const productRoutes = require('./routes/productRoutes'); // <--- TAMBAHKAN INI
const supplierRoutes = require('./routes/supplierRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const locationRoutes = require('./routes/locationRoutes.');
const stockRoutes = require('./routes/stockRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API berjalan dengan sukses!' });
});

// --- (Nanti kita tambahkan routes untuk /api/products, /api/stock, dll di sini) ---

app.use('/api/products', productRoutes); // <--- TAMBAHKAN INI
app.use('/api/suppliers', supplierRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/stock', stockRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
});