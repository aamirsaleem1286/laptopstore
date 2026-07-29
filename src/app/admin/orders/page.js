'use client';

import { useState, useEffect } from 'react';
import { HiOutlineEye, HiOutlineMagnifyingGlass, HiOutlineRefresh } from 'react-icons/hi';
import DataTable from '@/components/ui/DataTable';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const paymentColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(val);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm">
          <HiOutlineRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 text-sm rounded-md capitalize ${statusFilter === s ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative flex-1 max-w-xs ml-auto">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-sm"
          />
        </form>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={[
          { key: 'orderNumber', label: 'Order #' },
          { key: 'customer', label: 'Customer', render: (row) => row.user?.name || row.guestEmail || 'Guest' },
          { key: 'items', label: 'Items', render: (row) => row.items?.reduce((s, i) => s + i.quantity, 0) || 0 },
          { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
          { key: 'status', label: 'Status', render: (row) => (
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[row.status] || statusColors.pending}`}>
              {row.status}
            </span>
          )},
          { key: 'paymentStatus', label: 'Payment', render: (row) => (
            <span className={`px-2 py-1 text-xs rounded-full ${paymentColors[row.paymentStatus] || paymentColors.pending}`}>
              {row.paymentStatus}
            </span>
          )},
          { key: 'date', label: 'Date', render: (row) => formatDate(row.createdAt) },
          { key: 'actions', label: '', render: (row) => (
            <button
              onClick={() => setSelectedOrder(row)}
              className="p-1.5 hover:bg-gray-100 rounded"
              title="View Details"
            >
              <HiOutlineEye className="w-4 h-4" />
            </button>
          )},
        ]}
        data={orders}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Order {selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-gray-500">Placed on {formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>

              {/* Status Update */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Update Status:</span>
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                    disabled={updating || selectedOrder.status === s}
                    className={`px-3 py-1 text-xs rounded-full capitalize border ${
                      selectedOrder.status === s
                        ? 'bg-primary-100 text-primary-700 border-primary-300'
                        : 'hover:bg-gray-100 border-gray-200'
                    } disabled:opacity-40`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Customer</h3>
                  <p className="text-sm">{selectedOrder.user?.name || selectedOrder.guestEmail || 'Guest'}</p>
                  {selectedOrder.user?.email && (
                    <p className="text-sm text-gray-500">{selectedOrder.user.email}</p>
                  )}
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Payment</h3>
                  <p className="text-sm capitalize">Method: {selectedOrder.paymentMethod?.replace('_', ' ')}</p>
                  <p className="text-sm">
                    Status:{' '}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${paymentColors[selectedOrder.paymentStatus]}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>

                <div className="p-4 border rounded-lg md:col-span-2">
                  <h3 className="font-medium text-sm mb-2">Shipping Address</h3>
                  <p className="text-sm">{selectedOrder.shippingAddress?.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.shippingAddress?.street}</p>
                  <p className="text-sm text-gray-500">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zip}
                  </p>
                  <p className="text-sm text-gray-500">Phone: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Items ({selectedOrder.items?.length || 0})</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      {item.image && (
                        <img src={`/images/products/${item.image}`} alt="" className="w-14 h-14 object-contain rounded bg-white" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.processor && `${item.processor} · `}{item.storage && `${item.storage}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Rs. {item.price?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{selectedOrder.shippingCost === 0 ? 'Free' : formatCurrency(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
