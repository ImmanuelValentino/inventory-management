// File: /client/src/app/page.js

'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/components/auth/withAuth'; // Lindungi halaman ini
import { getDashboardSummary } from '@/services/api';
import useAuth from '@/hooks/useAuth'; // Impor hook untuk sapaan
import Link from 'next/link';

// Helper untuk format Rupiah
const formatRupiah = (number) => {
  if (number === null || number === undefined) {
    number = 0;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

// Helper untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

// Komponen Kartu Statistik
function StatCard({ title, value, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </div>
  );
}

function HomePage() {
  const { user } = useAuth(); // Ambil data user untuk sapaan
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      const data = await getDashboardSummary();
      setSummary(data);
      setIsLoading(false);
    };

    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading Dashboard...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">
        Selamat Datang, {user?.email || 'Pengguna'}!
      </h1>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8"> {/* <-- UBAH JADI 4 KOLOM */}
        <StatCard
          title="Total Nilai Persediaan (Modal)"
          value={formatRupiah(summary.totalValue)}
        />

        {/* --- KARTU BARU --- */}
        <StatCard
          title="Potensi Pendapatan (Jual)"
          value={formatRupiah(summary.potentialRevenue)}
        />
        {/* --- BATAS KARTU BARU --- */}

        <StatCard
          title="Total SKU Produk"
          value={summary.productsCount}
          description="Jumlah jenis barang unik"
        />
        <StatCard
          title="Stok Menipis"
          value={summary.lowStockItems.length}
          description="Barang di bawah stok minimum"
        />
      </div>

      {/* Grid 2 Kolom untuk Daftar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Kolom Stok Menipis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Barang Stok Menipis</h2>
          {summary.lowStockItems.length > 0 ? (
            <ul className="divide-y divide-gray-200 text-black">
              {summary.lowStockItems.map(item => (
                <li key={item.product_id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">({item.sku}) {item.name}</p>
                    <p className="text-sm text-gray-500">Stok Min: {item.minimum_stock_level}</p>
                  </div>
                  <span className="text-lg font-bold text-red-600">{item.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Semua stok aman!</p>
          )}
        </div>

        {/* Kolom Transaksi Terakhir */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Aktivitas Terakhir</h2>
          {summary.recentMovements.length > 0 ? (
            <ul className="divide-y divide-gray-200 text-black">
              {summary.recentMovements.map(move => (
                <li key={move.movement_id} className="py-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{move.movement_type} - {move.products?.name || 'N/A'}</p>
                    <span className={`font-bold ${move.quantity > 0 || move.movement_type === 'INBOUND' ? 'text-green-600' : 'text-red-600'
                      }`}>{move.quantity > 0 ? `+${move.quantity}` : move.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(move.movement_date)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Belum ada transaksi.</p>
          )}
        </div>

      </div>
    </main>
  );
}

// Bungkus halaman utama dengan 'withAuth'
export default withAuth(HomePage);