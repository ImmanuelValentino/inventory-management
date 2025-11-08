// File: /client/src/app/admin/users/page.js (Versi Lengkap)

'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/components/auth/withAuth';
import useAuth from '@/hooks/useAuth'; // Untuk cek role
import { getUsers, updateUserRole } from '@/services/api';

function ManageUsersPage() {
    const { user: currentUser } = useAuth(); // Ambil data user yang sedang login
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError('Gagal memuat data user.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Hanya fetch data jika user adalah admin
        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    }, [currentUser]); // Jalan saat data currentUser tersedia

    // Handler untuk mengubah role
    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            // Update state lokal agar UI langsung berubah
            setUsers(prevUsers =>
                prevUsers.map(u => (u.id === userId ? { ...u, role: newRole } : u))
            );
            alert('Role user berhasil diupdate!');
        } catch (err) {
            alert('Gagal mengupdate role.');
        }
    };

    // 1. Tampilkan loading
    if (isLoading && !users.length) { // Tampilkan loading jika belum ada user
        return <main className="p-24 text-black">Loading data user...</main>;
    }

    // 2. Jika bukan admin, blokir halaman
    if (currentUser?.role !== 'admin') {
        return (
            <main className="p-24 text-center">
                <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
                <p className="text-black">Halaman ini hanya untuk Admin.</p>
            </main>
        );
    }

    // 3. Tampilkan halaman admin
    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
            <h1 className="text-2xl font-bold mb-6 text-black">Manajemen User</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="w-full max-w-4xl overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full bg-white border text-black text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {/* --- 1. TAMBAHKAN HEADER EMAIL --- */}
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Role</th>
                            <th className="py-2 px-4 border-b text-left">User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">

                                {/* --- 2. TAMBAHKAN DATA EMAIL --- */}
                                <td className="py-2 px-4 border-b">{user.email}</td>

                                <td className="py-2 px-4 border-b">
                                    {/* Jangan biarkan admin mengubah rolenya sendiri */}
                                    {user.id === currentUser.id ? (
                                        <span className="font-bold">{user.role} (Anda)</span>
                                    ) : (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        >
                                            <option value="admin">admin</option>
                                            <option value="staff_gudang">staff_gudang</option>
                                            {/* <option value="viewer">viewer</option> */}
                                        </select>
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b text-gray-500">{user.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default withAuth(ManageUsersPage);