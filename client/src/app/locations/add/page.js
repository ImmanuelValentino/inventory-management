// File: /client/src/app/locations/add/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Impor 'createLocation' DAN 'getWarehouses'
import { createLocation, getWarehouses } from '../../../services/api';
import withAuth from '@/components/auth/withAuth';

function AddLocationPage() {
    const router = useRouter();
    const [warehouses, setWarehouses] = useState([]); // State untuk daftar gudang
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        warehouse_id: '' // Simpan ID gudang yang dipilih
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ambil data gudang untuk dropdown saat halaman dimuat
    useEffect(() => {
        const fetchWarehouses = async () => {
            const data = await getWarehouses();
            setWarehouses(data);
            // Set nilai default dropdown ke gudang pertama jika ada
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, warehouse_id: data[0].warehouse_id }));
            }
        };
        fetchWarehouses();
    }, []); // [] = Hanya jalan sekali

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            // pastikan warehouse_id disimpan sebagai angka
            [name]: name === 'warehouse_id' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.warehouse_id) {
            setError('Silakan pilih gudang terlebih dahulu.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            await createLocation(formData);
            router.push('/locations'); // Kembali ke daftar lokasi
        } catch (err) {
            console.error('Failed to create location:', err);
            setError(err.message || 'Gagal menambahkan lokasi.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Tambah Lokasi Baru</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">

                {/* Dropdown Gudang */}
                <div className="mb-4">
                    <label htmlFor="warehouse_id" className="block text-sm font-medium text-gray-700">Pilih Gudang</label>
                    <select
                        name="warehouse_id"
                        id="warehouse_id"
                        required
                        value={formData.warehouse_id}
                        onChange={handleChange}
                        className={inputStyle}
                    >
                        <option value="">-- Pilih Gudang --</option>
                        {warehouses.map(wh => (
                            <option key={wh.warehouse_id} value={wh.warehouse_id}>
                                {wh.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kode Lokasi */}
                <div className="mb-4">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Kode Lokasi (Contoh: RAK-A-01)</label>
                    <input type="text" name="code" id="code" required value={formData.code} onChange={handleChange} className={inputStyle} />
                </div>

                {/* Deskripsi */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
                    <textarea name="description" id="description" rows="3" value={formData.description} onChange={handleChange} className={inputStyle}></textarea>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Lokasi'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}

export default withAuth(AddLocationPage);