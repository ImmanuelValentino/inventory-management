// File: /server/middleware/adminOnlyMiddleware.js

const adminOnlyMiddleware = async (req, res, next) => {
    try {
        // req.user di-attach oleh authMiddleware sebelumnya
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Access denied. Admin role required.' });
        }

        // Jika lolos (adalah admin), lanjut ke controller
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error during role check.' });
    }
};

// PASTIKAN BARIS DI BAWAH INI SEPERTI INI:
module.exports = adminOnlyMiddleware; // <-- INI BENAR (langsung ekspor fungsinya)