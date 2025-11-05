// File: /client/src/app/locations/edit/[id]/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// Impor semua API yang dibutuhkan
import { getLocationById, updateLocation, getWarehouses } from '../../../../services/api';

export default function EditLocationPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [warehouses, setWarehouses] = useState([]); // State untuk daftar gudang
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        warehouse_id: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ambil data gudang (untuk dropdown) dan data lokasi (untuk form)
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // 1. Ambil daftar gudang
                const whData = await getWarehouses();
                setWarehouses(whData);

                // 2. Ambil data lokasi spesifik
                const locData = await getLocationById(id);
                setFormData(locData);

            } catch (err) {
                console.error(err);
                setError('Gagal mengambil data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
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
            // Kirim hanya data yang dibutuhkan untuk update
            const { code, description, warehouse_id } = formData;
            await updateLocation(id, { code, description, warehouse_id });
            router.push('/locations');
        } catch (err) {
            console.error('Failed to update location:', err);
            setError(err.message || 'Gagal mengupdate lokasi.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    if (isLoading && !error) {
        return (
            <main className="flex min-h-screen flex-col items-center p-24">
                <p>Loading data lokasi...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Edit Lokasi</h1>

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
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Kode Lokasi</label>
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
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Menyimpan...' : 'Update Lokasi'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}