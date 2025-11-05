// File: /client/src/app/suppliers/page.js

'use client';

import { useState, useEffect } from 'react';
import { getSuppliers, deleteSupplier } from '../../services/api';
import Link from 'next/link';

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSuppliers = async () => {
        setIsLoading(true);
        const data = await getSuppliers();
        setSuppliers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
            try {
                await deleteSupplier(id);
                fetchSuppliers(); // Refresh data
            } catch (error) {
                console.error('Gagal menghapus supplier:', error);
                alert('Gagal menghapus supplier.');
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Master Supplier</h1>

            {isLoading ? (
                <p>Loading data supplier...</p>
            ) : (
                <div className="w-full max-w-5xl">

                    <div className="mb-4">
                        <Link href="/suppliers/add">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                + Tambah Supplier
                            </button>
                        </Link>
                    </div>

                    {suppliers.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Tidak ada data supplier.
                        </p>
                    ) : (
                        <table className="min-w-full bg-white border text-black">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Nama Supplier</th>
                                    <th className="py-2 px-4 border-b text-left">Kontak Person</th>
                                    <th className="py-2 px-4 border-b text-left">Telepon</th>
                                    <th className="py-2 px-4 border-b text-left">Email</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.supplier_id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{supplier.name}</td>
                                        <td className="py-2 px-4 border-b">{supplier.contact_person}</td>
                                        <td className="py-2 px-4 border-b">{supplier.phone}</td>
                                        <td className="py-2 px-4 border-b">{supplier.email}</td>
                                        <td className="py-2 px-4 border-b">
                                            <Link href={`/suppliers/edit/${supplier.supplier_id}`}>
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600">
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(supplier.supplier_id)}
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