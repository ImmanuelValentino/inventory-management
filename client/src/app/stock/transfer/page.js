// File: /client/src/app/stock/transfer/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Impor API yang kita butuhkan
import {
    createStockTransfer,
    getProducts,
    getLocations
} from '../../../services/api';
import withAuth from '@/components/auth/withAuth';

function StockTransferPage() {
    const router = useRouter();

    // State untuk menyimpan data master
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);

    // State untuk form
    const [formData, setFormData] = useState({
        product_id: '',
        from_location_id: '',
        to_location_id: '',
        quantity: 1,
        reference_number: '',
        notes: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ambil data master untuk dropdown
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
        setError(null);

        // Validasi frontend
        if (!formData.product_id || !formData.from_location_id || !formData.to_location_id || !formData.quantity) {
            setError('Semua field bertanda * tidak boleh kosong.');
            return;
        }
        if (formData.from_location_id === formData.to_location_id) {
            setError('Lokasi Asal dan Tujuan tidak boleh sama.');
            return;
        }

        setIsLoading(true);

        try {
            await createStockTransfer({
                ...formData,
                // Pastikan ID dikirim sebagai angka
                product_id: parseInt(formData.product_id),
                from_location_id: parseInt(formData.from_location_id),
                to_location_id: parseInt(formData.to_location_id)
            });

            alert('Transfer stok berhasil dicatat!');
            // Arahkan ke laporan stok untuk melihat hasilnya
            router.push('/reports/stock');
        } catch (err) {
            console.error('Failed to create stock transfer:', err);
            // Tampilkan error dari backend (misal: "Stok tidak mencukupi")
            setError(err.response?.data?.error || err.message || 'Gagal mencatat transfer.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Transfer Stok</h1>

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

                {/* Dropdown Lokasi Asal */}
                <div className="mb-4">
                    <label htmlFor="from_location_id" className="block text-sm font-medium text-gray-700">Dari Lokasi *</label>
                    <select name="from_location_id" id="from_location_id" required value={formData.from_location_id} onChange={handleChange} className={inputStyle}>
                        <option value="">-- Pilih Lokasi Asal --</option>
                        {locations.map(l => (
                            <option key={`from-${l.location_id}`} value={l.location_id}>
                                {l.warehouses?.name} - {l.code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dropdown Lokasi Tujuan */}
                <div className="mb-4">
                    <label htmlFor="to_location_id" className="block text-sm font-medium text-gray-700">Ke Lokasi *</label>
                    <select name="to_location_id" id="to_location_id" required value={formData.to_location_id} onChange={handleChange} className={inputStyle}>
                        <option value="">-- Pilih Lokasi Tujuan --</option>
                        {locations.map(l => (
                            <option key={`to-${l.location_id}`} value={l.location_id}>
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
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Memindahkan...' : 'Proses Transfer'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}

export default withAuth(StockTransferPage);