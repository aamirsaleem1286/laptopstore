'use client';
import './globals.css';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }) {
  const [isCartOpen, setCartOpen] = useState(false);

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
      <body className="bg-gray-50 font-sans min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar onCartToggle={() => setCartOpen(!isCartOpen)} />
            <main className="flex-grow container mx-auto px-4 py-6">
              {children}
            </main>
            <Footer />
            <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
