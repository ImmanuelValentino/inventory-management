// File: /client/src/app/warehouses/page.js

'use client';

import { useState, useEffect } from 'react';
import { getWarehouses, deleteWarehouse } from '../../services/api';
import Link from 'next/link';
import withAuth from '@/components/auth/withAuth';


function WarehousesPage() {
    const [warehouses, setWarehouses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWarehouses = async () => {
        setIsLoading(true);
        const data = await getWarehouses();
        setWarehouses(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus gudang ini?')) {
            try {
                await deleteWarehouse(id);
                fetchWarehouses(); // Refresh data
            } catch (error) {
                console.error('Gagal menghapus gudang:', error);
                alert('Gagal menghapus gudang.');
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Master Gudang</h1>

            {isLoading ? (
                <p>Loading data gudang...</p>
            ) : (
                <div className="w-full max-w-4xl">

                    <div className="mb-4">
                        <Link href="/warehouses/add">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                + Tambah Gudang
                            </button>
                        </Link>
                    </div>

                    {warehouses.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Tidak ada data gudang.
                        </p>
                    ) : (
                        <table className="min-w-full bg-white border text-black">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Nama Gudang</th>
                                    <th className="py-2 px-4 border-b text-left">Alamat</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warehouses.map((warehouse) => (
                                    <tr key={warehouse.warehouse_id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{warehouse.name}</td>
                                        <td className="py-2 px-4 border-b">{warehouse.address}</td>
                                        <td className="py-2 px-4 border-b">
                                            <Link href={`/warehouses/edit/${warehouse.warehouse_id}`}>
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600">
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(warehouse.warehouse_id)}
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


export default withAuth(WarehousesPage);