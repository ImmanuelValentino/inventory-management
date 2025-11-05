// File: /client/src/app/warehouses/add/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createWarehouse } from '../../../services/api';

export default function AddWarehousePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await createWarehouse(formData);
            router.push('/warehouses'); // Kembali ke daftar gudang
        } catch (err) {
            console.error('Failed to create warehouse:', err);
            setError(err.message || 'Gagal menambahkan gudang.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Tambah Gudang Baru</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Gudang</label>
                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat</label>
                    <textarea name="address" id="address" rows="3" value={formData.address} onChange={handleChange} className={inputStyle}></textarea>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Gudang'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}