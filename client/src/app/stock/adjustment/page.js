// File: /client/src/app/stock/adjustment/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    createStockAdjustment,
    getProducts,
    getLocations
} from '../../../services/api';

export default function StockAdjustmentPage() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);

    const [formData, setFormData] = useState({
        product_id: '',
        location_id: '',
        quantity: 0, // Default 0
        reference_number: '',
        notes: '' // Wajib diisi
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [productsData, locationsData] = await Promise.all([
                    getProducts(),
                    getLocations()
                ]);
                setProducts(productsData);
                setLocations(locationsData);
            } catch (err) {
                setError('Gagal memuat data master. Coba refresh halaman.');
            }
        };
        fetchMasterData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'number' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.product_id || !formData.location_id) {
            setError('Produk dan Lokasi tidak boleh kosong.');
            return;
        }
        if (formData.quantity === 0) {
            setError('Kuantitas tidak boleh 0.');
            return;
        }
        if (!formData.notes || formData.notes.trim() === '') {
            setError('Alasan/Catatan wajib diisi untuk penyesuaian.');
            return;
        }

        setIsLoading(true);

        try {
            await createStockAdjustment(formData);

            alert('Penyesuaian stok berhasil dicatat!');
            router.push('/reports/stock'); // Arahkan ke laporan stok
        } catch (err) {
            console.error('Failed to create stock adjustment:', err);
            setError(err.response?.data?.error || err.message || 'Gagal mencatat penyesuaian.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Penyesuaian Stok (Adjustment)</h1>

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

                {/* Dropdown Lokasi */}
                <div className="mb-4">
                    <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Lokasi *</label>
                    <select name="location_id" id="location_id" required value={formData.location_id} onChange={handleChange} className={inputStyle}>
                        <option value="">-- Pilih Lokasi --</option>
                        {locations.map(l => (
                            <option key={l.location_id} value={l.location_id}>
                                {l.warehouses?.name} - {l.code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kuantitas (Bisa Positif/Negatif) */}
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Kuantitas Penyesuaian *</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        required
                        value={formData.quantity}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="Contoh: -2 (untuk barang rusak) or 1 (untuk barang ditemukan)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Isi angka negatif (cth: -2) untuk mengurangi stok, atau positif (cth: 1) untuk menambah stok.</p>
                </div>

                {/* Catatan (Wajib) */}
                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Alasan Penyesuaian *</label>
                    <textarea
                        name="notes"
                        id="notes"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="Contoh: Barang rusak, Kesalahan hitung, Stock opname 01/01/2024"
                    ></textarea>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Penyesuaian'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}