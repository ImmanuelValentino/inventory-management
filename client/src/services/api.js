// File: /client/src/services/api.js
import axios from 'axios';

// Ambil URL API kita dari file .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL
});

/**
 * =======================================
 * API UNTUK PRODUCTS (MASTER BARANG)
 * =======================================
 */

// Fungsi untuk mengambil semua produk
export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Kembalikan array kosong jika error
    }
};

// --- TAMBAHKAN FUNGSI DI BAWAH INI ---

// Fungsi untuk mengambil SATU produk berdasarkan ID
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk membuat produk baru
export const createProduct = async (productData) => {
    try {
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error; // Lempar error untuk ditangani di form
    }
};

// Fungsi untuk meng-UPDATE produk
export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error(`Error updating product with id ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk meng-HAPUS produk
export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
    }
};

// --- BATAS PENAMBAHAN FUNGSI ---

/**
 * =======================================
 * API UNTUK SUPPLIERS (MASTER SUPPLIER)
 * =======================================
 */

// Fungsi untuk mengambil semua supplier
export const getSuppliers = async () => {
    try {
        const response = await api.get('/suppliers');
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return [];
    }
};

// Fungsi untuk mengambil SATU supplier berdasarkan ID
export const getSupplierById = async (id) => {
    try {
        const response = await api.get(`/suppliers/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching supplier with id ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk membuat supplier baru
export const createSupplier = async (supplierData) => {
    try {
        const response = await api.post('/suppliers', supplierData);
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};

// Fungsi untuk meng-UPDATE supplier
export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await api.put(`/suppliers/${id}`, supplierData);
        return response.data;
    } catch (error) {
        console.error(`Error updating supplier with id ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk meng-HAPUS supplier
export const deleteSupplier = async (id) => {
    try {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting supplier with id ${id}:`, error);
        throw error;
    }
};

/**
 * =======================================
 * API UNTUK WAREHOUSES (MASTER GUDANG)
 * =======================================
 */

export const getWarehouses = async () => {
    try {
        const response = await api.get('/warehouses');
        return response.data;
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        return [];
    }
};

export const getWarehouseById = async (id) => {
    try {
        const response = await api.get(`/warehouses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching warehouse with id ${id}:`, error);
        throw error;
    }
};

export const createWarehouse = async (warehouseData) => {
    try {
        const response = await api.post('/warehouses', warehouseData);
        return response.data;
    } catch (error) {
        console.error('Error creating warehouse:', error);
        throw error;
    }
};

export const updateWarehouse = async (id, warehouseData) => {
    try {
        const response = await api.put(`/warehouses/${id}`, warehouseData);
        return response.data;
    } catch (error) {
        console.error(`Error updating warehouse with id ${id}:`, error);
        throw error;
    }
};

export const deleteWarehouse = async (id) => {
    try {
        const response = await api.delete(`/warehouses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting warehouse with id ${id}:`, error);
        throw error;
    }
};


/**
 * =======================================
 * API UNTUK LOCATIONS (MASTER LOKASI/RAK)
 * =======================================
 */

export const getLocations = async () => {
    try {
        const response = await api.get('/locations');
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
};

export const getLocationById = async (id) => {
    try {
        const response = await api.get(`/locations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching location with id ${id}:`, error);
        throw error;
    }
};

export const createLocation = async (locationData) => {
    try {
        const response = await api.post('/locations', locationData);
        return response.data;
    } catch (error) {
        console.error('Error creating location:', error);
        throw error;
    }
};

export const updateLocation = async (id, locationData) => {
    try {
        const response = await api.put(`/locations/${id}`, locationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating location with id ${id}:`, error);
        throw error;
    }
};

export const deleteLocation = async (id) => {
    try {
        const response = await api.delete(`/locations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting location with id ${id}:`, error);
        throw error;
    }
};

/**
 * =======================================
 * API UNTUK STOCK TRANSACTIONS
 * =======================================
 */

export const createStockInbound = async (inboundData) => {
    try {
        // inboundData = { product_id, location_id, quantity, supplier_id, ... }
        const response = await api.post('/stock/inbound', inboundData);
        return response.data;
    } catch (error) {
        console.error('Error creating stock inbound:', error);
        throw error;
    }
};

export const getStockLevels = async () => {
    try {
        const response = await api.get('/stock/levels');
        return response.data;
    } catch (error) {
        console.error('Error fetching stock levels:', error);
        return [];
    }
};

export const createStockOutbound = async (outboundData) => {
    try {
        const response = await api.post('/stock/outbound', outboundData);
        return response.data;
    } catch (error) {
        console.error('Error creating stock outbound:', error);
        // Lempar error agar bisa ditangkap oleh form
        throw error;
    }
};

export const createStockTransfer = async (transferData) => {
    try {
        const response = await api.post('/stock/transfer', transferData);
        return response.data;
    } catch (error) {
        console.error('Error creating stock transfer:', error);
        // Lempar error agar bisa ditangkap oleh form
        throw error;
    }
};

export const createStockAdjustment = async (adjData) => {
    try {
        const response = await api.post('/stock/adjustment', adjData);
        return response.data;
    } catch (error) {
        console.error('Error creating stock adjustment:', error);
        throw error;
    }
};

export const getStockMovements = async () => {
    try {
        const response = await api.get('/stock/movements');
        return response.data;
    } catch (error) {
        console.error('Error fetching stock movements:', error);
        return [];
    }
};

export default api;