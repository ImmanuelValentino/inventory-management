// File: /client/src/app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // <-- 1. IMPOR NAVBAR

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sistem Inventory Gudang",
  description: "Dibangun dengan Next.js, Express, dan Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar /> {/* <-- 2. TAMBAHKAN NAVBAR DI SINI */}
          <main className="flex-grow">{children}</main> {/* 3. Bungkus children */}
        </div>
      </body>
    </html>
  );
}