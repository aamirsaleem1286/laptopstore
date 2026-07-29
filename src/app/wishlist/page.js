'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/account/login');
  }, [user, authLoading]);

  if (authLoading) return <div className="text-center py-8">Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="text-center py-12 text-gray-400">
        <p>Your wishlist is empty.</p>
        <Link href="/products" className="text-primary-600 hover:underline mt-2 inline-block">Browse Products</Link>
      </div>
    </div>
  );
}
