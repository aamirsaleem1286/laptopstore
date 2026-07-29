'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineHome, HiOutlineCube, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineTag, HiOutlineTicket, HiOutlineChartBar, HiOutlineCog, HiOutlineShieldCheck, HiOutlineArrowLeft } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { href: '/admin/products', label: 'Products', icon: HiOutlineCube },
  { href: '/admin/orders', label: 'Orders', icon: HiOutlineShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: HiOutlineUsers },
  { href: '/admin/categories', label: 'Categories', icon: HiOutlineTag },
  { href: '/admin/banners', label: 'Banners', icon: HiOutlineTicket },
  { href: '/admin/coupons', label: 'Coupons', icon: HiOutlineTicket },
  { href: '/admin/reports', label: 'Reports', icon: HiOutlineChartBar },
  { href: '/admin/settings', label: 'Settings', icon: HiOutlineCog },
  { href: '/admin/admins', label: 'Admin Users', icon: HiOutlineShieldCheck },
];

export default function AdminLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pathname, setPathname] = useState('/admin/dashboard');

  // Update pathname on mount and route changes
  if (typeof window !== 'undefined') {
    setPathname(window.location.pathname);
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || !['admin', 'manager', 'staff'].includes(user.role)) {
    return null; // Middleware will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary-600">Admin Panel</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-gray-100 rounded">
              <HiOutlineArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${pathname === item.href ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary-600">← View Store</Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded">
              <HiOutlineHome className="w-6 h-6" />
            </button>
            <h1 className="font-semibold">Admin Panel</h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}