// File: /client/src/app/products/page.js

'use client';

import { useState, useEffect } from 'react';
// 1. Impor deleteProduct
import { getProducts, deleteProduct } from '../../services/api';
import Link from 'next/link';
import withAuth from '@/components/auth/withAuth';

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. Buat fungsi untuk handle hapus
    const handleDelete = async (id) => {
        // Tampilkan konfirmasi
        if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await deleteProduct(id);
                // Refresh data setelah berhasil hapus
                fetchProducts();
            } catch (error) {
                console.error('Gagal menghapus produk:', error);
                alert('Gagal menghapus produk.');
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Master Barang</h1>

            {isLoading ? (
                <p>Loading data produk...</p>
            ) : (
                <div className="w-full max-w-5xl"> {/* Perlebar sedikit */}

                    <div className="mb-4">
                        <Link href="/products/add">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                + Tambah Produk
                            </button>
                        </Link>
                    </div>

                    {products.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Tidak ada data produk. Silakan tambah produk baru.
                        </p>
                    ) : (
                        <table className="min-w-full bg-white border text-black">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">SKU</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Produk</th>
                                    <th className="py-2 px-4 border-b text-left">Kategori</th>
                                    <th className="py-2 px-4 border-b text-left">Harga Jual</th>
                                    <th className="py-2 px-4 border-b text-left">Stok Min.</th>
                                    <th className="py-2 px-4 border-b text-left">Aksi</th> {/* 3. Tambah kolom Aksi */}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.product_id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{product.sku}</td>
                                        <td className="py-2 px-4 border-b">{product.name}</td>
                                        <td className="py-2 px-4 border-b">{product.category}</td>
                                        <td className="py-2 px-4 border-b">{product.selling_price}</td>
                                        <td className="py-2 px-4 border-b">{product.minimum_stock_level}</td>

                                        {/* 4. Tambah Tombol Aksi */}
                                        <td className="py-2 px-4 border-b">
                                            <Link href={`/products/edit/${product.product_id}`}>
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600">
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.product_id)}
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

export default withAuth(ProductsPage);