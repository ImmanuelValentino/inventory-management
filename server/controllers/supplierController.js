// File: /server/controllers/supplierController.js

const supabase = require('../config/supabaseClient');

// 1. Mengambil SEMUA supplier
const getAllSuppliers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('suppliers')
            .select('*')
            .order('supplier_id', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Mengambil SATU supplier berdasarkan ID
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('suppliers')
            .select('*')
            .eq('supplier_id', id)
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Membuat supplier BARU
const createSupplier = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('suppliers')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Meng-UPDATE supplier
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('suppliers')
            .update(req.body)
            .eq('supplier_id', id)
            .select()
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Menghapus supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        // Hati-hati: Pastikan tidak ada 'products' atau 'stock_movements'
        // yang terhubung ke supplier ini sebelum menghapus (kita akan handle ini nanti)

        const { data, error } = await supabase
            .from('suppliers')
            .delete()
            .eq('supplier_id', id)
            .select()
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json({ message: 'Supplier deleted', data: data });
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};