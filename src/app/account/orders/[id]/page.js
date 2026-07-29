'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import OrderTable from '@/components/account/OrderTable';
import Badge from '@/components/ui/Badge';

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract order ID from route params (Next.js 13 app router)
  const orderId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login');
      return;
    }
    if (user && orderId) {
      fetchOrder();
    }
  }, [user, authLoading, orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      setOrder(data.order || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(val);

  const formatDate = (date) => new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

  if (authLoading || loading) return <div className="text-center py-8">Loading...</div>;
  if (!order) return <div className="text-center py-8">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-primary-600 hover:underline mb-4">
        <HiOutlineChevronLeft className="w-4 h-4" /> Back to Orders
      </button>

      <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
      <p className="text-gray-500 mb-4">Placed on {formatDate(order.createdAt)}</p>

      {/* Status */}
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
          order.status === 'refunded' ? 'bg-gray-100 text-gray-700' :
          'bg-gray-100 text-gray-700'
        }`}
        >
          {order.status}
        </span>
        <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="ml-3">
          {order.paymentStatus}
        </Badge>
      </div>

      {/* Shipping Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="font-medium mb-2">Shipping Address</h2>
        <p className="text-sm">
          {order.shippingAddress?.name}<br />
          {order.shippingAddress?.street}<br />
          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
          {order.shippingAddress?.country}<br />
          Phone: {order.shippingAddress?.phone}
        </p>
      </div>

      {/* Items Table */}
      <OrderTable orders={[order]} hideHeader hideTotals={false} className="mb-6" />

      {/* Totals */}
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span>{order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base border-t pt-2">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
