'use client';

import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineBan, HiOutlineRefresh } from 'react-icons/hi';
import DataTable from '@/components/ui/DataTable';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      if (tab === 'wholesale') params.set('role', 'wholesale_customer');
      if (tab === 'blocked') params.set('blocked', 'true');

      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, tab]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleApproveWholesale = async (id) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/customers/${id}/approve-wholesale`, { method: 'PUT' });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectWholesale = async (id) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/customers/${id}/approve-wholesale`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleBlock = async (id, currentlyBlocked) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/customers/${id}/block`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: !currentlyBlocked }),
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button onClick={fetchCustomers} className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm">
          <HiOutlineRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { key: 'all', label: 'All Customers' },
          { key: 'wholesale', label: 'Wholesale' },
          { key: 'blocked', label: 'Blocked' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1); }}
            className={`px-4 py-1.5 text-sm rounded-md ${tab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or business..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
        />
      </form>

      {/* Customers Table */}
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Type', render: (row) => (
            <span className={`px-2 py-1 text-xs rounded-full ${
              row.role === 'wholesale_customer' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {row.role === 'wholesale_customer' ? 'Wholesale' : 'Retail'}
            </span>
          )},
          { key: 'wholesaleStatus', label: 'Wholesale Status', render: (row) => row.role === 'wholesale_customer' ? (
            <span className={`px-2 py-1 text-xs rounded-full ${
              row.wholesaleStatus === 'approved' ? 'bg-green-100 text-green-700' :
              row.wholesaleStatus === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{row.wholesaleStatus}</span>
          ) : '-' },
          { key: 'businessName', label: 'Business', render: (row) => row.businessName || '-' },
          { key: 'phone', label: 'Phone' },
          { key: 'orders', label: 'Orders', render: (row) => row.orderCount || 0 },
          { key: 'joined', label: 'Joined', render: (row) => formatDate(row.createdAt) },
          { key: 'status', label: 'Status', render: (row) => row.isBlocked ? (
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Blocked</span>
          ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
          )},
          { key: 'actions', label: 'Actions', render: (row) => (
            <div className="flex items-center gap-1">
              {row.role === 'wholesale_customer' && row.wholesaleStatus === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproveWholesale(row._id)}
                    disabled={actionLoading === row._id}
                    className="p-1 hover:bg-green-50 rounded text-green-600"
                    title="Approve Wholesale"
                  >
                    <HiOutlineCheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRejectWholesale(row._id)}
                    disabled={actionLoading === row._id}
                    className="p-1 hover:bg-red-50 rounded text-red-600"
                    title="Reject Wholesale"
                  >
                    <HiOutlineXCircle className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => handleToggleBlock(row._id, row.isBlocked)}
                disabled={actionLoading === row._id}
                className={`p-1 hover:bg-gray-100 rounded ${row.isBlocked ? 'text-green-600' : 'text-red-600'}`}
                title={row.isBlocked ? 'Unblock User' : 'Block User'}
              >
                <HiOutlineBan className="w-4 h-4" />
              </button>
            </div>
          )},
        ]}
        data={customers}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
