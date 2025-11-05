// File: /client/src/components/auth/withAuth.js

'use client'; // Ini adalah komponen client

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Ini adalah HOC (Higher-Order Component)
const withAuth = (WrappedComponent) => {
    // Ini adalah komponen baru yang akan me-render
    // WrappedComponent HANYA JIKA sudah login
    const Wrapper = (props) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            // Cek apakah token ada di localStorage
            const token = localStorage.getItem('accessToken');

            if (!token) {
                // Jika tidak ada token, paksa redirect ke halaman login
                router.replace('/login');
            } else {
                // Jika ada token, izinkan komponen untuk di-render
                setIsLoading(false);
            }
        }, [router]);

        // Tampilkan loading spinner selagi mengecek token
        if (isLoading) {
            return (
                <main className="flex min-h-screen flex-col items-center justify-center p-24">
                    <p>Memeriksa autentikasi...</p>
                </main>
            );
        }

        // Jika sudah login (isLoading false dan ada token),
        // render komponen halaman yang sebenarnya
        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;