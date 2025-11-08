// File: /server/controllers/dashboardController.js

const supabase = require('../config/supabaseClient');

const getDashboardSummary = async (req, res) => {
    try {
        // Kita akan menjalankan 5 kueri secara paralel
        const [
            productsCountPromise,
            lowStockItemsPromise,
            totalValuePromise,
            potentialRevenuePromise, // <-- 1. TAMBAHKAN INI
            recentMovementsPromise
        ] = [
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.rpc('get_low_stock_items'),
                supabase.rpc('get_total_inventory_value').single(),
                supabase.rpc('get_potential_revenue').single(), // <-- 2. PANGGIL FUNGSI BARU
                supabase.from('stock_movements')
                    .select('*, products(name)')
                    .order('movement_date', { ascending: false })
                    .limit(5)
            ];

        // Tunggu semua promise selesai
        const [
            { count: productsCount, error: countError },
            { data: lowStockItems, error: lowStockError },
            { data: totalValueData, error: totalValueError },
            { data: potentialRevenueData, error: revenueError }, // <-- 3. TAMBAHKAN INI
            { data: recentMovements, error: movementsError }
        ] = await Promise.all([
            productsCountPromise,
            lowStockItemsPromise,
            totalValuePromise,
            potentialRevenuePromise, // <-- 4. TAMBAHKAN INI
            recentMovementsPromise
        ]);

        // Cek jika ada error
        if (countError) throw countError;
        if (lowStockError) throw lowStockError;
        if (totalValueError) throw totalValueError;
        if (revenueError) throw revenueError; // <-- 5. TAMBAHKAN PENGECEKAN
        if (movementsError) throw movementsError;

        // Kirim semua data dalam satu JSON
        res.status(200).json({
            productsCount: productsCount || 0,
            lowStockItems: lowStockItems || [],
            totalValue: totalValueData?.total_value || 0,
            potentialRevenue: potentialRevenueData?.total_revenue || 0, // <-- 6. TAMBAHKAN HASIL BARU
            recentMovements: recentMovements || []
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDashboardSummary
};