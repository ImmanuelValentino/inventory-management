// File: /client/src/app/suppliers/add/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupplier } from '../../../services/api';
import withAuth from '@/components/auth/withAuth';

function AddSupplierPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_person: '',
        phone: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await createSupplier(formData);
            router.push('/suppliers'); // Kembali ke daftar supplier
        } catch (err) {
            console.error('Failed to create supplier:', err);
            setError(err.message || 'Gagal menambahkan supplier.');
            setIsLoading(false);
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black";

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">Tambah Supplier Baru</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Supplier</label>
                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="mb-4">
                    <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">Kontak Person</label>
                    <input type="text" name="contact_person" id="contact_person" value={formData.contact_person} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telepon</label>
                    <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputStyle} />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat</label>
                    <textarea name="address" id="address" rows="3" value={formData.address} onChange={handleChange} className={inputStyle}></textarea>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Supplier'}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}

            </form>
        </main>
    );
}

export default withAuth(AddSupplierPage);