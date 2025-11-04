// File: /server/controllers/warehouseController.js

const supabase = require('../config/supabaseClient');

// 1. Mengambil SEMUA gudang
const getAllWarehouses = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('warehouses')
            .select('*')
            .order('warehouse_id', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Mengambil SATU gudang berdasarkan ID
const getWarehouseById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('warehouses')
            .select('*')
            .eq('warehouse_id', id)
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Warehouse not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Membuat gudang BARU
const createWarehouse = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('warehouses')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Meng-UPDATE gudang
const updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('warehouses')
            .update(req.body)
            .eq('warehouse_id', id)
            .select()
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Warehouse not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Menghapus gudang
const deleteWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('warehouses')
            .delete()
            .eq('warehouse_id', id)
            .select()
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json({ message: 'Warehouse deleted', data: data });
        } else {
            res.status(404).json({ error: 'Warehouse not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
};