// File: /server/middleware/authMiddleware.js

const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
    // 1. Ambil token dari header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Validasi token ke Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            throw error;
        }

        // 3. Ambil role dari tabel public.users
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        // 4. Sukses! Tambahkan data user (termasuk role) ke object 'req'
        req.user = profile; // Sekarang req.user = { id: '...', role: 'staff_gudang' }

        next(); // Lanjutkan ke controller
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;