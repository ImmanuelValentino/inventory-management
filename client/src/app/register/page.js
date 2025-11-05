// File: /client/src/app/register/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '../../services/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await registerUser(formData);
            alert('Registrasi berhasil! Silakan login.');
            router.push('/login'); // Arahkan ke halaman login
        } catch (err) {
            setError(err.error || err.message || 'Registrasi gagal.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">Register Akun Baru</h1>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Mendaftar...' : 'Register'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

                <p className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Login di sini
                    </Link>
                </p>
            </form>
        </main>
    );
};