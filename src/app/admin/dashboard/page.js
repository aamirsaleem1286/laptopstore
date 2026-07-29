'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlineCube, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineExclamationTriangle, HiOutlineArrowTrendingUp, HiOutlineTrash } from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DataTable from '@/components/ui/DataTable';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, productsRes] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetch('/api/admin/products?limit=100'),
        ]);

        const dashboardData = await dashboardRes.json();
        const productsData = await productsRes.json();

        setStats(dashboardData.stats);
        setRecentOrders(dashboardData.recentOrders || []);
        setLowStockProducts((productsData.products || []).filter((p) => p.stock <= (p.lowStockThreshold || 5)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const formatCurrency = (val) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: HiOutlineArrowTrendingUp, color: 'bg-green-50 text-green-600' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: HiOutlineShoppingCart, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Products', value: stats?.totalProducts || 0, icon: HiOutlineCube, color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: HiOutlineUsers, color: 'bg-orange-50 text-orange-600' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.label === 'Total Products' ? '/admin/products' : stat.label === 'Total Orders' ? '/admin/orders' : stat.label === 'Total Customers' ? '/admin/customers' : '#'} className={`p-5 rounded-xl ${stat.color} hover:opacity-80 transition-opacity`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8" />
            </div>
          </Link>
        ))}

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Link href="/admin/products" className="p-5 rounded-xl bg-red-50 text-red-600 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-2xl font-bold mt-1">{lowStockProducts.length}</p>
              </div>
              <HiOutlineExclamationTriangle className="w-8 h-8" />
            </div>
            <p className="text-xs mt-2">{lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} need restocking</p>
          </Link>
        )}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Overview (Last 30 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(value), 'Revenue']} />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">Chart data loads from sales reports</p>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary-600 hover:underline">View All</Link>
          </div>
          <DataTable
            columns={[
              { key: 'orderNumber', label: 'Order #' },
              { key: 'customer', label: 'Customer', render: (row) => row.user?.name || row.guestEmail || 'Guest' },
              { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
              { key: 'status', label: 'Status', render: (row) => (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  row.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  row.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                  row.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{row.status}</span>
              )},
              { key: 'paymentStatus', label: 'Payment', render: (row) => (
                <span className={`px-2 py-1 text-xs rounded-full ${row.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{row.paymentStatus}</span>
              )},
            ]}
            data={recentOrders}
          />
        </div>
      </div>

      {/* Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-red-600">Low Stock Products ({lowStockProducts.length})</h2>
            <Link href="/admin/products" className="text-sm text-primary-600 hover:underline">Manage All</Link>
          </div>
          <DataTable
            columns={[
              { key: 'name', label: 'Product' },
              { key: 'brand', label: 'Brand' },
              { key: 'stock', label: 'Stock', render: (row) => <span className="font-medium text-red-600">{row.stock}</span> },
              { key: 'lowStockThreshold', label: 'Threshold' },
            ]}
            data={lowStockProducts}
          />
        </div>
      )}
    </div>
  );
}