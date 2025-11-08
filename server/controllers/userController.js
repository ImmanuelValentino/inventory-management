// File: /server/controllers/userController.js

const supabase = require('../config/supabaseClient');

// Mengambil semua user (email & role)
const getAllUsers = async (req, res) => {
    try {
        // Kita perlu mengambil data dari tabel 'public.users'
        // dan menggabungkannya dengan email dari 'auth.users'
        // Supabase tidak bisa join 'public' dan 'auth' secara langsung
        // Jadi kita ambil dari 'public.users' lalu ambil email-nya

        // 1. Ambil semua dari public.users
        const { data: profiles, error: profileError } = await supabase
            .from('users') // Ini tabel public.users
            .select('id, role, full_name'); // full_name mungkin null

        if (profileError) throw profileError;

        // 2. Ambil semua dari auth.users
        // Ini adalah trik untuk memanggil fungsi admin
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        // 3. Gabungkan datanya
        const users = profiles.map(profile => {
            const authUser = authUsers.users.find(u => u.id === profile.id);
            return {
                ...profile,
                email: authUser ? authUser.email : 'N/A'
            };
        });

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mengubah role seorang user
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params; // ID user yang akan diubah
        const { role } = req.body; // Role baru ('admin' or 'staff_gudang')

        // Validasi role
        if (!role || (role !== 'admin' && role !== 'staff_gudang')) {
            return res.status(400).json({ error: 'Invalid role specified.' });
        }

        // Update role di tabel 'public.users'
        const { data, error } = await supabase
            .from('users') // tabel public.users
            .update({ role: role })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole
};