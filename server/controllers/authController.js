// File: /server/controllers/authController.js

const supabase = require('../config/supabaseClient');

// ==========================================================
// FUNGSI REGISTER (Tidak berubah)
// ==========================================================
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Panggil fungsi 'signUp' dari Supabase Auth
        // Trigger yang kita buat di DB akan otomatis mengisi tabel 'public.users'
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) throw error;

        res.status(201).json({ message: 'User created successfully', data: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ==========================================================
// FUNGSI LOGIN (INI YANG KITA PERBAIKI)
// ==========================================================
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // 1. Lakukan login ke Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) throw authError; // Jika email/password salah, lempar error

        // 2. Jika login berhasil, AMBIL PROFILE (dan ROLE) dari tabel 'public.users'
        const { data: profileData, error: profileError } = await supabase
            .from('users') // Ini adalah tabel 'public.users' yang kita buat
            .select('id, role') // Ambil 'id' dan 'role'
            .eq('id', authData.user.id) // Cocokkan ID dari hasil login
            .single(); // Ambil satu baris saja

        if (profileError) {
            // Ini terjadi jika trigger gagal atau user ada di auth tapi tidak di public.users
            throw new Error('User profile not found. Error: ' + profileError.message);
        }

        // 3. Gabungkan data session (token) dan data profile (role)    
        //    dan kirim kembali ke frontend
        res.status(200).json({
            session: authData.session,
            user: profileData // <-- PENTING: Kita kirim profile (dgn role), BUKAN authData.user
        });

    } catch (error) {
        // Tangkap error dari authError atau profileError
        res.status(401).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};