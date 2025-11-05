// File: /client/src/app/reports/stock/page.js

'use client';

import { useState, useEffect } from 'react';
import { getStockLevels } from '../../../services/api'; // <-- Impor API kita

export default function StockLevelsReport() {
    const [stockLevels, setStockLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStockLevels = async () => {
        setIsLoading(true);
        const data = await getStockLevels();
        setStockLevels(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStockLevels();
    }, []); // [] = Hanya jalan sekali

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Laporan Stok Saat Ini</h1>

            {isLoading ? (
                <p>Loading data stok...</p>
            ) : (
                <div className="w-full max-w-5xl">

                    {/* (Opsional) Tombol Refresh */}
                    <div className="mb-4">
                        <button
                            onClick={fetchStockLevels}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Refresh Data
                        </button>
                    </div>

                    {stockLevels.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Belum ada data stok. Silakan lakukan Stok Masuk.
                        </p>
                    ) : (
                        <table className="min-w-full bg-white border text-black">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">SKU</th>
                                    <th className="py-2 px-4 border-b text-left">Nama Produk</th>
                                    <th className="py-2 px-4 border-b text-left">Gudang</th>
                                    <th className="py-2 px-4 border-b text-left">Lokasi</th>
                                    <th className="py-2 px-4 border-b text-left">Kuantitas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Kita akan me-render data relasional yang kita ambil.
                  Gunakan 'optional chaining' (?) untuk keamanan
                */}
                                {stockLevels.map((level, index) => (
                                    <tr key={`${level.product_id}-${level.location_id}-${index}`} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{level.products?.sku || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{level.products?.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{level.locations?.warehouses?.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{level.locations?.code || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b font-bold">{level.quantity}</td>
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