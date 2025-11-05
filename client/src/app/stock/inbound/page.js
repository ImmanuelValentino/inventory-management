// File: /client/src/app/stock/inbound/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Impor semua yang kita butuhkan
import {
    createStockInbound,
    getProducts,
    getSuppliers,
    getLocations
} from '../../../services/api';
import withAuth from '@/components/auth/withAuth';

function StockInboundPage() {
    const router = useRouter();

    // State untuk menyimpan data master
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [locations, setLocations] = useState([]);

    // State untuk form
    const [formData, setFormData] = useState({
        product_id: '',
        supplier_id: '',
        location_id: '',
        quantity: 1,
        reference_number: '',
        notes: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ambil semua data master untuk dropdown
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [productsData, suppliersData, locationsData] = await Promise.all([
                    getProducts(),
                    getSuppliers(),
                    getLocations()
                ]);
                setProducts(productsData);
                setSuppliers(suppliersData);
                setLocations(locationsData);
            } catch (err) {
                setError('Gagal memuat data master. Coba refresh halaman.');
            }
        };
        fetchMasterData();
    }, []); // [] = Hanya jalan sekali

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'number' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.product_id || !formData.location_id || !formData.quantity) {
            setError('Produk, Lokasi, dan Kuantitas tidak boleh kosong.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            await createStockInbound({
                ...formData,
                // Pastikan ID dikirim sebagai angka
                product_id: parseInt(formData.product_id),
                location_id: parseInt(formData.location_id),
                supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null
            });

            alert('Stok masuk berhasil dicatat!');
            // TODO: Nanti kita redirect ke halaman Laporan Stok
            router.push('/'); // Kembali ke home
        } catch (err) {
            console.error('Failed to create stock inbound:', err);
            setError(err.response?.data?.error || err.message || 'Gagal mencatat stok.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Catat Stok Masuk (Inbound)</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">

                {/* Dropdown Produk */}
                <div className="mb-4">
                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Produk *</label>
                    <select name="product_id" id="product_id" required value={formData.product_id} onChange={handleChange} className={inputStyle}>
                        <option value="">-- Pilih Produk --</option>
                        {products.map(p => (
                            <option key={p.product_id} value={p.product_id}>
                                {p.sku} - {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dropdown Supplier */}
                <div className="mb-4">
                    <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">Supplier (Opsional)</label>
                    <select name="supplier_id" id="supplier_id" value={formData.supplier_id} onChange={handleChange} className={inputStyle}>
                        <option value="">-- Pilih Supplier --</option>
                        {suppliers.map(s => (
                            <option key={s.supplier_id} value={s.supplier_id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dropdown Lokasi */}
                <div className="mb-4">
                    <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Lokasi Tujuan *</label>
                    <select name="location_id" id="location_id" required value={formData.location_id} onChange={handleChange} className={inputStyle}>
                        <option value="">-- Pilih Lokasi --</option>
                        {locations.map(l => (
                            <option key={l.location_id} value={l.location_id}>
                                {l.warehouses?.name} - {l.code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kuantitas */}
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Kuantitas *</label>
                    <input type="number" name="quantity" id="quantity" min="1" required value={formData.quantity} onChange={handleChange} className={inputStyle} />
                </div>

                {/* No. Referensi */}
                <div className="mb-4">
                    <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">No. Referensi (Opsional)</label>
                    <input type="text" name="reference_number" id="reference_number" value={formData.reference_number} onChange={handleChange} className={inputStyle} />
                </div>

                {/* Catatan */}
                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                    <textarea name="notes" id="notes" rows="3" value={formData.notes} onChange={handleChange} className={inputStyle}></textarea>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Stok Masuk'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}

export default withAuth(StockInboundPage);