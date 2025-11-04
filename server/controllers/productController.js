// File: /server/controllers/productController.js

const supabase = require('../config/supabaseClient'); // Impor koneksi Supabase kita

// 1. Mengambil SEMUA produk
const getAllProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('product_id', { ascending: true }); // Urutkan biar rapi

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Mengambil SATU produk berdasarkan ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('product_id', id)
            .single(); // .single() untuk ambil 1 objek, bukan array

        if (error) throw error;

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Membuat produk BARU
const createProduct = async (req, res) => {
    try {
        // Data produk baru ada di 'req.body'
        const { data, error } = await supabase
            .from('products')
            .insert([req.body]) // [req.body] karena insert butuh array
            .select() // .select() agar mengembalikan data yg baru dibuat
            .single();

        if (error) throw error;

        res.status(201).json(data); // 201 = Created
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Meng-UPDATE produk
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('products')
            .update(req.body) // Data baru untuk di-update
            .eq('product_id', id)
            .select()
            .single();

        if (error) throw error;

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Menghapus produk
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('product_id', id)
            .select() // Kembalikan data yg dihapus
            .single();

        if (error) throw error;

        if (data) {
            res.status(200).json({ message: 'Product deleted', data: data });
        } else {
            // Jika tidak ada data yg terhapus (mungkin ID salah)
            // Supabase delete tidak error jika ID tdk ketemu, jadi kita cek manual
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};