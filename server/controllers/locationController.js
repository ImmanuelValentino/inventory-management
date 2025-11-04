// File: /server/controllers/locationController.js

const supabase = require('../config/supabaseClient');

// 1. Mengambil SEMUA lokasi (beserta nama gudangnya)
const getAllLocations = async (req, res) => {
    try {
        // '*, warehouses(name)' memberi tahu Supabase untuk
        // mengambil semua kolom dari 'locations'
        // DAN kolom 'name' dari tabel 'warehouses' yang terhubung
        const { data, error } = await supabase
            .from('locations')
            .select('*, warehouses(name)') // <-- INI PENTING
            .order('location_id', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Mengambil SATU lokasi berdasarkan ID
const getLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('locations')
            .select('*, warehouses(name)') // <-- INI PENTING
            .eq('location_id', id)
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Membuat lokasi BARU
const createLocation = async (req, res) => {
    try {
        // req.body akan berisi: { code, description, warehouse_id }
        const { data, error } = await supabase
            .from('locations')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Meng-UPDATE lokasi
const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('locations')
            .update(req.body)
            .eq('location_id', id)
            .select()
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Menghapus lokasi
const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('locations')
            .delete()
            .eq('location_id', id)
            .select()
            .single();

        if (error) throw error;
        if (data) {
            res.status(200).json({ message: 'Location deleted', data: data });
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
};