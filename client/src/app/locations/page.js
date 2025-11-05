// File: /client/src/app/locations/page.js

'use client';

import { useState, useEffect } from 'react';
import { getLocations, deleteLocation } from '../../services/api';
import Link from 'next/link';

export default function LocationsPage() {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLocations = async () => {
        setIsLoading(true);
        const data = await getLocations();
        setLocations(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
            try {
                await deleteLocation(id);
                fetchLocations(); // Refresh data
            } catch (error) {
                console.error('Gagal menghapus lokasi:', error);
                alert('Gagal menghapus lokasi.');
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Master Lokasi (Rak/Zona)</h1>

            {isLoading ? (
                <p>Loading data lokasi...</p>
            ) : (
                <div className="w-full max-w-4xl">

                    <div className="mb-4">
                        <Link href="/locations/add">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                + Tambah Lokasi
                            </button>
                        </Link>
                    </div>

                    {locations.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Tidak ada data lokasi.
                        </p>
                    ) : (
                        <table className="min-w-full bg-white border text-black">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Kode Lokasi</th>
                                    <th className="py-2 px-4 border-b text-left">Deskripsi</th>
                                    <th className="py-2 px-4 border-b text-left">Gudang</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map((location) => (
                                    <tr key={location.location_id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{location.code}</td>
                                        <td className="py-2 px-4 border-b">{location.description}</td>
                                        {/* Tampilkan nama gudang dari data relasi */}
                                        <td className="py-2 px-4 border-b">{location.warehouses?.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <Link href={`/locations/edit/${location.location_id}`}>
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600">
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(location.location_id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </main>
    );
}