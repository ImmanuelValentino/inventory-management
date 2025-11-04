// File: /server/controllers/stockController.js

const supabase = require('../config/supabaseClient');

// Fungsi untuk mencatat STOK MASUK
const handleInbound = async (req, res) => {
    const {
        product_id,
        location_id,
        quantity,
        supplier_id,
        reference_number,
        notes
    } = req.body;

    // TODO: Nanti kita akan ambil 'user_id' dari middleware auth
    const user_id = null;

    // Validasi dasar
    if (!product_id || !location_id || !quantity) {
        return res.status(400).json({ error: 'Product, Location, and Quantity are required.' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be positive.' });
    }

    try {
        // Panggil fungsi RPC 'handle_stock_inbound' di Supabase
        const { data, error } = await supabase.rpc('handle_stock_inbound', {
            product_id_in: product_id,
            location_id_in: location_id,
            quantity_in: quantity,
            supplier_id_in: supplier_id || null, // Supplier boleh null
            reference_in: reference_number || null,
            notes_in: notes || null,
            user_id_in: user_id
        });

        if (error) throw error;

        res.status(200).json(data); // Kembalikan JSON dari fungsi
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStockLevels = async (req, res) => {
    try {
        // Ini adalah kueri JOIN:
        // 1. Ambil semua dari 'stock_levels'
        // 2. Ambil 'sku' dan 'name' dari 'products' yang terhubung
        // 3. Ambil 'code' dari 'locations' yang terhubung
        // 4. Ambil 'name' dari 'warehouses' yang terhubung DENGAN 'locations'
        const { data, error } = await supabase
            .from('stock_levels')
            .select(`
        *,
        products (sku, name),
        locations (code, warehouses (name))
        `)
            .order('product_id', { ascending: true }); // Urutkan

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const handleOutbound = async (req, res) => {
    const {
        product_id,
        location_id,
        quantity,
        reference_number,
        notes
    } = req.body;

    // TODO: Nanti kita akan ambil 'user_id' dari middleware auth
    const user_id = null;

    // Validasi dasar
    if (!product_id || !location_id || !quantity) {
        return res.status(400).json({ error: 'Product, Location, and Quantity are required.' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be positive.' });
    }

    try {
        // Panggil fungsi RPC 'handle_stock_outbound' di Supabase
        const { data, error } = await supabase.rpc('handle_stock_outbound', {
            product_id_in: product_id,
            location_id_in: location_id,
            quantity_in: quantity,
            reference_in: reference_number || null,
            notes_in: notes || null,
            user_id_in: user_id
        });

        if (error) {
            // Jika error dari RAISE EXCEPTION, error akan ada di 'message'
            // dan kodenya 'P0001' (uncaught_exception)
            if (error.code === 'P0001') {
                return res.status(400).json({ error: error.message });
            }
            throw error;
        }

        res.status(200).json(data); // Kembalikan JSON dari fungsi
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleTransfer = async (req, res) => {
    const {
        product_id,
        from_location_id,
        to_location_id,
        quantity,
        reference_number,
        notes
    } = req.body;

    // TODO: Nanti kita akan ambil 'user_id' dari middleware auth
    const user_id = null;

    // Validasi dasar
    if (!product_id || !from_location_id || !to_location_id || !quantity) {
        return res.status(400).json({ error: 'Product, From Location, To Location, and Quantity are required.' });
    }
    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be positive.' });
    }

    try {
        // Panggil fungsi RPC 'handle_stock_transfer' di Supabase
        const { data, error } = await supabase.rpc('handle_stock_transfer', {
            product_id_in: product_id,
            from_location_id_in: from_location_id,
            to_location_id_in: to_location_id,
            quantity_in: quantity,
            reference_in: reference_number || null,
            notes_in: notes || null,
            user_id_in: user_id
        });

        if (error) {
            // Tangkap error validasi dari DB (Stok tdk cukup / Lokasi sama)
            if (error.code === 'P0001') {
                return res.status(400).json({ error: error.message });
            }
            throw error;
        }

        res.status(200).json(data); // Kembalikan JSON dari fungsi
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const handleAdjustment = async (req, res) => {
    const {
        product_id,
        location_id,
        quantity,
        reference_number,
        notes
    } = req.body;

    const user_id = null; // Nanti ambil dari auth

    // Validasi dasar
    if (!product_id || !location_id || !quantity) {
        return res.status(400).json({ error: 'Product, Location, and Quantity are required.' });
    }
    if (quantity === 0) {
        return res.status(400).json({ error: 'Quantity cannot be zero.' });
    }
    // Notes/alasan WAJIB diisi untuk adjustment
    if (!notes || notes.trim() === '') {
        return res.status(400).json({ error: 'Notes/Reason is required for adjustments.' });
    }

    try {
        const { data, error } = await supabase.rpc('handle_stock_adjustment', {
            product_id_in: product_id,
            location_id_in: location_id,
            quantity_in: quantity,
            reference_in: reference_number || null,
            notes_in: notes, // Wajib ada
            user_id_in: user_id
        });

        if (error) {
            if (error.code === 'P0001') {
                return res.status(400).json({ error: error.message });
            }
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getStockMovements = async (req, res) => {
    try {
        // Ini adalah kueri JOIN yang paling kompleks sejauh ini
        // Kita akan mengambil:
        // - Semua data dari 'stock_movements'
        // - 'sku' dan 'name' dari 'products'
        // - 'name' dari 'suppliers' (jika ada)
        // - Data 'from_location' (termasuk nama gudangnya)
        // - Data 'to_location' (termasuk nama gudangnya)

        // Kita menggunakan alias (cth: from_location:...)
        // untuk 'locations' karena kita join tabel yang sama dua kali
        const { data, error } = await supabase
            .from('stock_movements')
            .select(`
        *,
        products (sku, name),
        suppliers (name),
        from_location:locations!from_location_id (code, warehouses (name)),
        to_location:locations!to_location_id (code, warehouses (name))
        `)
            // Urutkan berdasarkan yang terbaru di atas
            .order('movement_date', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- UPDATE EXPORTS DI BAWAH ---
module.exports = {
    handleInbound,
    getStockLevels,
    handleOutbound,
    handleTransfer,
    handleAdjustment,
    getStockMovements // <-- Tambahkan ini
};