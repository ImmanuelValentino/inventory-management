// File: /client/src/app/reports/movements/page.js

'use client';

import { useState, useEffect } from 'react';
import { getStockMovements } from '../../../services/api';

// Helper untuk format tanggal
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

// Helper untuk memberi warna pada kuantitas
const QuantityCell = ({ value, type }) => {
    let colorClass = 'text-black';
    let prefix = '';

    if (type === 'INBOUND' || (type === 'ADJUSTMENT' && value > 0)) {
        colorClass = 'text-green-600';
        prefix = '+';
    } else if (type === 'OUTBOUND' || (type === 'ADJUSTMENT' && value < 0)) {
        colorClass = 'text-red-600';
    } else if (type === 'TRANSFER') {
        colorClass = 'text-blue-600';
    }

    return (
        <td className={`py-2 px-4 border-b font-bold ${colorClass}`}>
            {/* Untuk transfer, kuantitasnya kita simpan sbg positif di DB */}
            {type === 'TRANSFER' ? value : (prefix + value)}
        </td>
    );
};

export default function StockMovementsReport() {
    const [movements, setMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMovements = async () => {
        setIsLoading(true);
        const data = await getStockMovements();
        setMovements(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMovements();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Laporan Riwayat Pergerakan Stok</h1>

            {isLoading ? (
                <p>Loading data riwayat...</p>
            ) : (
                <div className="w-full max-w-7xl"> {/* Dibuat lebih lebar */}

                    <div className="mb-4">
                        <button
                            onClick={fetchMovements}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Refresh Data
                        </button>
                    </div>

                    {movements.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Belum ada riwayat pergerakan stok.
                        </p>
                    ) : (
                        <table className="min-w-full bg-white border text-black text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Tanggal</th>
                                    <th className="py-2 px-4 border-b text-left">Tipe</th>
                                    <th className="py-2 px-4 border-b text-left">Produk</th>
                                    <th className="py-2 px-4 border-b text-left">Kuantitas</th>
                                    <th className="py-2 px-4 border-b text-left">Dari Lokasi</th>
                                    <th className="py-2 px-4 border-b text-left">Ke Lokasi</th>
                                    <th className="py-2 px-4 border-b text-left">Supplier</th>
                                    <th className="py-2 px-4 border-b text-left">Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((move) => (
                                    <tr key={move.movement_id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{formatDate(move.movement_date)}</td>
                                        <td className="py-2 px-4 border-b">{move.movement_type}</td>
                                        <td className="py-2 px-4 border-b">
                                            ({move.products?.sku || 'N/A'}) {move.products?.name || 'N/A'}
                                        </td>

                                        {/* Sel Kuantitas dengan warna */}
                                        <QuantityCell value={move.quantity} type={move.movement_type} />

                                        {/* Lokasi Asal (Gunakan data 'from_location') */}
                                        <td className="py-2 px-4 border-b">
                                            {move.from_location ?
                                                `${move.from_location.warehouses?.name} - ${move.from_location.code}` : 'N/A'}
                                        </td>

                                        {/* Lokasi Tujuan (Gunakan data 'to_location') */}
                                        <td className="py-2 px-4 border-b">
                                            {move.to_location ?
                                                `${move.to_location.warehouses?.name} - ${move.to_location.code}` : 'N/A'}
                                        </td>

                                        <td className="py-2 px-4 border-b">{move.suppliers?.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{move.notes || 'N/A'}</td>
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