// File: /client/src/components/Navbar.js (atau @/components/Navbar.js)

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth'; // Pastikan path @/hooks/useAuth.js benar

// Halaman-halaman yang tidak perlu Navbar
const noNavPaths = ['/login', '/register'];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth(); // Ambil data user dari hook

    // Fungsi untuk Logout
    const handleLogout = () => {
        // Hapus token dan data user dari localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        alert('Anda telah logout.');
        // Arahkan kembali ke halaman login
        router.push('/login');
    };

    // Jangan tampilkan Navbar di halaman login/register
    if (noNavPaths.includes(pathname)) {
        return null;
    }

    return (
        <nav className="bg-gray-800 text-white p-4 w-full sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo/Brand */}
                <Link href="/" className="font-bold text-xl hover:text-gray-300">
                    Inventory Gudang
                </Link>

                <div className="flex space-x-4 items-center">
                    <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded">Home</Link>

                    {/* ========================================================== */}
                    {/* KONDISI ROLE-BASED: Hanya tampil jika user adalah 'admin' */}
                    {/* ========================================================== */}
                    {user && user.role === 'admin' && (
                        <div className="relative group">
                            <button className="hover:bg-gray-700 px-3 py-2 rounded">Master Data</button>
                            <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <Link href="/products" className="block px-4 py-2 text-sm hover:bg-gray-600">Master Barang</Link>
                                <Link href="/suppliers" className="block px-4 py-2 text-sm hover:bg-gray-600">Master Supplier</Link>
                                <Link href="/warehouses" className="block px-4 py-2 text-sm hover:bg-gray-600">Master Gudang</Link>
                                <Link href="/locations" className="block px-4 py-2 text-sm hover:bg-gray-600">Master Lokasi</Link>
                                {/* --- INI BARIS BARU YANG DITAMBAHKAN --- */}
                                <Link href="/admin/users" className="block px-4 py-2 text-sm hover:bg-gray-600 font-bold">Manajemen User</Link>
                            </div>
                        </div>
                    )}
                    {/* --- Batas Kondisi Role --- */}

                    {/* ========================================================== */}
                    {/* Dropdown Transaksi (Bisa diakses 'admin' dan 'staff_gudang') */}
                    {/* ========================================================== */}
                    <div className="relative group">
                        <button className="hover:bg-gray-700 px-3 py-2 rounded">Transaksi</button>
                        <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <Link href="/stock/inbound" className="block px-4 py-2 text-sm hover:bg-gray-600">Stok Masuk</Link>
                            <Link href="/stock/outbound" className="block px-4 py-2 text-sm hover:bg-gray-600">Stok Keluar</Link>
                            <Link href="/stock/transfer" className="block px-4 py-2 text-sm hover:bg-gray-600">Transfer Stok</Link>
                            <Link href="/stock/adjustment" className="block px-4 py-2 text-sm hover:bg-gray-600">Penyesuaian Stok</Link>
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* Dropdown Laporan (Bisa diakses 'admin' dan 'staff_gudang') */}
                    {/* ========================================================== */}
                    <div className="relative group">
                        <button className="hover:bg-gray-700 px-3 py-2 rounded">Laporan</button>
                        <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <Link href="/reports/stock" className="block px-4 py-2 text-sm hover:bg-gray-600">Laporan Stok</Link>
                            <Link href="/reports/movements" className="block px-4 py-2 text-sm hover:bg-gray-600">Laporan Riwayat</Link>
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* Tombol Logout */}
                    {/* ========================================================== */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}