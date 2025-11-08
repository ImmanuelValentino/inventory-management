// File: /server/controllers/stockController.js

const supabase = require('../config/supabaseClient');

// ==========================================================
// 1. STOK MASUK (INBOUND)
// ==========================================================
const handleInbound = async (req, res) => {
    const {
        product_id,
        location_id,
        quantity,
        supplier_id,
        reference_number,
        notes
    } = req.body;

    // INI PERUBAHANNYA: Ambil 'id' dari 'req.user' yang di-attach oleh middleware
    const user_id = req.user.id;

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
            supplier_id_in: supplier_id || null,
            reference_in: reference_number || null,
            notes_in: notes || null,
            user_id_in: user_id // <-- INI PERUBAHANNYA (Tidak null lagi)
        });

        if (error) throw error;

        res.status(200).json(data); // Kembalikan JSON dari fungsi
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================================
// 2. STOK KELUAR (OUTBOUND)
// ==========================================================
const handleOutbound = async (req, res) => {
    const {
        product_id,
        location_id,
        quantity,
        reference_number,
        notes
    } = req.body;

    // INI PERUBAHANNYA: Ambil 'id' dari 'req.user'
    const user_id = req.user.id;

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
            user_id_in: user_id // <-- INI PERUBAHANNYA (Tidak null lagi)
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

// ==========================================================
// 3. TRANSFER STOK
// ==========================================================
const handleTransfer = async (req, res) => {
    const {
        product_id,
        from_location_id,
        to_location_id,
        quantity,
        reference_number,
        notes
    } = req.body;

    // INI PERUBAHANNYA: Ambil 'id' dari 'req.user'
    const user_id = req.user.id;

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
            user_id_in: user_id // <-- INI PERUBAHANNYA (Tidak null lagi)
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

// ==========================================================
// 4. PENYESUAIAN STOK (ADJUSTMENT)
// ==========================================================
const handleAdjustment = async (req, res) => {
    const {
        product_id,
        location_id,
        quantity,
        reference_number,
        notes
    } = req.body;

    // INI PERUBAHANNYA: Ambil 'id' dari 'req.user'
    const user_id = req.user.id;

    // Validasi dasar
    if (!product_id || !location_id || !quantity) {
        return res.status(400).json({ error: 'Product, Location, and Quantity are required.' });
    }
    if (quantity === 0) {
        return res.status(400).json({ error: 'Quantity cannot be zero.' });
    }
    if (!notes || notes.trim() === '') {
        return res.status(400).json({ error: 'Notes/Reason is required for adjustments.' });
    }

    try {
        const { data, error } = await supabase.rpc('handle_stock_adjustment', {
            product_id_in: product_id,
            location_id_in: location_id,
            quantity_in: quantity,
            reference_in: reference_number || null,
            notes_in: notes,
            user_id_in: user_id // <-- INI PERUBAHANNYA (Tidak null lagi)
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


// ==========================================================
// 5. LAPORAN STOK SAAT INI (TIDAK BERUBAH)
// ==========================================================
const getStockLevels = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stock_levels')
            .select(`
        *,
        products (sku, name),
        locations (code, warehouses (name))
      `)
            .order('product_id', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================================
// 6. LAPORAN RIWAYAT PERGERAKAN (TIDAK BERUBAH)
// ==========================================================
const getStockMovements = async (req, res) => {
    try {
        // 1. Ambil query parameter dari URL
        const { search, dateFrom, dateTo } = req.query;

        // 2. Mulai bangun kueri dasar
        let query = supabase
            .from('stock_movements')
            .select(`
        *,
        products (sku, name),
        suppliers (name),
        from_location:locations!from_location_id (code, warehouses (name)),
        to_location:locations!to_location_id (code, warehouses (name))
      `)
            .order('movement_date', { ascending: false }); // Selalu urutkan terbaru di atas

        // 3. Tambahkan filter ke kueri JIKA ada

        // Filter berdasarkan nama produk (search)
        if (search) {
            // 'ilike' = case-insensitive LIKE (tidak peduli huruf besar/kecil)
            query = query.ilike('products.name', `%${search}%`);
        }

        // Filter berdasarkan tanggal MULAI (dateFrom)
        if (dateFrom) {
            // 'gte' = greater than or equal
            query = query.gte('movement_date', dateFrom);
        }

        // Filter berdasarkan tanggal SELESAI (dateTo)
        if (dateTo) {
            // 'lte' = less than or equal
            query = query.lte('movement_date', dateTo);
        }

        // 4. Eksekusi kueri yang sudah dimodifikasi
        const { data, error } = await query;

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- EXPORT SEMUA FUNGSI ---
module.exports = {
    handleInbound,
    handleOutbound,
    handleTransfer,
    handleAdjustment,
    getStockLevels,
    getStockMovements
};