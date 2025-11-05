// File: /client/src/app/products/add/page.js

'use client'; // <-- PENTING! Kita butuh state & interaksi

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Gunakan navigation
import { createProduct } from '../../../services/api'; // <-- Impor API create
import withAuth from '@/components/auth/withAuth';

function AddProductPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        unit: 'pcs',
        category: '',
        cost_price: 0,
        selling_price: 0,
        minimum_stock_level: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fungsi untuk menangani perubahan input form
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    // Fungsi untuk menangani submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        setIsLoading(true);
        setError(null);

        try {
            // Panggil API untuk membuat produk
            await createProduct(formData);

            // Jika sukses, kembali ke halaman daftar produk
            router.push('/products');
        } catch (err) {
            console.error('Failed to create product:', err);
            setError(err.message || 'Gagal menambahkan produk. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    // Helper styling untuk input
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Tambah Produk Baru</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">

                {/* SKU */}
                <div className="mb-4">
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU (Stock Keeping Unit)</label>
                    <input
                        type="text"
                        name="sku"
                        id="sku"
                        required
                        value={formData.sku}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>

                {/* Nama Produk */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Produk</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>

                {/* Kategori */}
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
                    <input
                        type="text"
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>

                {/* Harga Beli (Cost Price) */}
                <div className="mb-4">
                    <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700">Harga Beli (Modal)</label>
                    <input
                        type="number"
                        name="cost_price"
                        id="cost_price"
                        step="0.01"
                        value={formData.cost_price}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>

                {/* Harga Jual (Selling Price) */}
                <div className="mb-4">
                    <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700">Harga Jual</label>
                    <input
                        type="number"
                        name="selling_price"
                        id="selling_price"
                        step="0.01"
                        value={formData.selling_price}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>

                {/* Stok Minimum */}
                <div className="mb-4">
                    <label htmlFor="minimum_stock_level" className="block text-sm font-medium text-gray-700">Stok Minimum</label>
                    <input
                        type="number"
                        name="minimum_stock_level"
                        id="minimum_stock_level"
                        step="1"
                        value={formData.minimum_stock_level}
                        onChange={handleChange}
                        className={inputStyle}
                    />
                </div>

                {/* Tombol Submit */}
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
                    </button>
                </div>

                {/* Pesan Error */}
                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}

export default withAuth(AddProductPage);