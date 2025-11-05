// File: /client/src/hooks/useAuth.js
'use client';
import { useState, useEffect } from 'react';

export default function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Hanya dijalankan di sisi client
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
    }, []);

    // Kembalikan data user
    return { user };
}