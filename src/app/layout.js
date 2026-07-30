'use client';
import './globals.css';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }) {
  const [isCartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Close cart on navigation change
    const handleRouteChange = () => setCartOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Laptop Wholesale & Retail</title>
        <meta name="description" content="Buy laptops wholesale and retail – the best deals on top brands." />
      </head>
      <body className={`bg-gray-50 font-sans min-h-screen flex flex-col ${isAdminPage ? '' : ''}`}>
        <AuthProvider>
          <CartProvider>
            {!isAdminPage && <Navbar onCartToggle={() => setCartOpen(!isCartOpen)} />}
            <main className={isAdminPage ? '' : 'flex-grow container mx-auto px-4 py-6'}>
              {children}
            </main>
            {!isAdminPage && <Footer />}
            <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
