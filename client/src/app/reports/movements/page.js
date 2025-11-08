// File: /client/src/app/reports/movements/page.js

'use client';

import { useState, useEffect } from 'react';
import { getStockMovements } from '@/services/api'; // (Pastikan path @/ benar)
import withAuth from '@/components/auth/withAuth';

// ... (Helper formatDate dan QuantityCell biarkan seperti sebelumnya)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

const QuantityCell = ({ value, type }) => {
    let colorClass = 'text-black';
    if (type === 'INBOUND' || (type === 'ADJUSTMENT' && value > 0)) {
        colorClass = 'text-green-600';
    } else if (type === 'OUTBOUND' || (type === 'ADJUSTMENT' && value < 0)) {
        colorClass = 'text-red-600';
    } else if (type === 'TRANSFER') {
        colorClass = 'text-blue-600';
    }
    const displayValue = (type !== 'OUTBOUND' && value > 0) ? `+${value}` : value;
    return (
        <td className={`py-2 px-4 border-b font-bold ${colorClass}`}>
            {displayValue}
        </td>
    );
};
// --- BATAS HELPER ---

function StockMovementsReport() { // Pastikan BUKAN export default
    const [movements, setMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- 1. TAMBAHKAN STATE UNTUK FILTERS ---
    const [filters, setFilters] = useState({
        search: '',
        dateFrom: '',
        dateTo: ''
    });

    // --- 2. BUAT FUNGSI FETCH DATA BARU ---
    const fetchMovements = async () => {
        setIsLoading(true);
        // Kirim 'filters' ke API
        const data = await getStockMovements(filters);
        setMovements(data);
        setIsLoading(false);
    };

    // --- 3. MODIFIKASI useEffect ---
    // Kita HAPUS array dependensi agar fetchMovements
    // tidak otomatis jalan saat filter berubah.
    // Kita akan panggil manual pakai tombol.
    useEffect(() => {
        fetchMovements();
    }, []); // Hanya jalan sekali saat halaman dibuka

    // --- 4. BUAT HANDLER UNTUK INPUT FORM ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // --- 5. BUAT HANDLER UNTUK SUBMIT FILTER ---
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchMovements(); // Panggil API dengan state 'filters' terbaru
    };

    // Helper styling
    const inputStyle = "bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
            <h1 className="text-2xl font-bold mb-4 text-black">Laporan Riwayat Pergerakan Stok</h1>

            {/* --- 6. TAMBAHKAN FORM FILTER --- */}
            <form onSubmit={handleFilterSubmit} className="w-full max-w-7xl bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Filter Search */}
                    <div>
                        <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-900">Cari Nama Produk</label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            className={inputStyle}
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Cth: Pulpen"
                        />
                    </div>
                    {/* Filter Tanggal Mulai */}
                    <div>
                        <label htmlFor="dateFrom" className="block mb-2 text-sm font-medium text-gray-900">Dari Tanggal</label>
                        <input
                            type="date"
                            id="dateFrom"
                            name="dateFrom"
                            className={inputStyle}
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                        />
                    </div>
                    {/* Filter Tanggal Selesai */}
                    <div>
                        <label htmlFor="dateTo" className="block mb-2 text-sm font-medium text-gray-900">Sampai Tanggal</label>
                        <input
                            type="date"
                            id="dateTo"
                            name="dateTo"
                            className={inputStyle}
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                        />
                    </div>
                    {/* Tombol Submit */}
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Cari / Terapkan Filter
                        </button>
                    </div>
                </div>
            </form>
            {/* --- BATAS FORM FILTER --- */}

            {isLoading ? (
                <p className="text-black">Loading data riwayat...</p>
            ) : (
                <div className="w-full max-w-7xl overflow-x-auto bg-white rounded-lg shadow-md">
                    {movements.length === 0 ? (
                        <p className="text-center text-gray-500 p-8">
                            Tidak ada data riwayat yang cocok dengan filter Anda.
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
                                        <QuantityCell value={move.quantity} type={move.movement_type} />
                                        <td className="py-2 px-4 border-b">
                                            {move.from_location ?
                                                `${move.from_location.warehouses?.name} - ${move.from_location.code}` : 'N/A'}
                                        </td>
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

export default withAuth(StockMovementsReport);