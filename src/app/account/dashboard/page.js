'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import OrderTable from '@/components/account/OrderTable';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function AccountDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login');
      return;
    }

    if (user) {
      setProfileForm({ name: user.name || '', phone: user.phone || '' });
      fetchOrders();
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      alert('Profile updated');
    } catch {
      alert('Failed to update');
    }
  };

  if (authLoading) return <div className="text-center py-8">Loading...</div>;
  if (!user) return null;

  const tabs = ['orders', 'profile', 'addresses', 'wishlist'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">My Account</h1>
      <p className="text-gray-500 mb-6">Welcome back, {user.name}</p>

      <div className="flex gap-2 border-b mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Order History</h2>
          <OrderTable orders={orders} />
        </div>
      )}

      {tab === 'profile' && (
        <div className="max-w-md">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={user.email} disabled className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            {user.role === 'wholesale_customer' && (
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input type="text" value={user.businessName || ''} disabled className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500" />
                <p className="text-xs text-gray-400 mt-1">Wholesale Status: <Badge variant={user.wholesaleStatus === 'approved' ? 'success' : 'warning'}>{user.wholesaleStatus}</Badge></p>
              </div>
            )}
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Save Changes</button>
          </form>
        </div>
      )}

      {tab === 'addresses' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>
          {user.addresses?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr, i) => (
                <div key={i} className="border rounded-lg p-4">
                  {addr.label && <p className="font-medium text-sm">{addr.label}</p>}
                  <p className="text-sm text-gray-600">{addr.street}, {addr.city}</p>
                  <p className="text-sm text-gray-600">{addr.state} - {addr.zip}</p>
                  {addr.isDefault && <Badge variant="primary">Default</Badge>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No addresses saved yet.</p>
          )}
        </div>
      )}

      {tab === 'wishlist' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Wishlist</h2>
          <Link href="/wishlist" className="text-primary-600 hover:underline">View Wishlist</Link>
        </div>
      )}
    </div>
  );
}
