'use client';

import Link from 'next/link';
import Badge from '@/components/ui/Badge';

const statusVariant = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'danger',
};

export default function OrderTable({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No orders yet.</p>
        <Link href="/products" className="text-primary-600 hover:underline mt-2 inline-block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Order #</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Items</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Total</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-700">Payment</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
              <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">{order.items.length}</td>
              <td className="px-4 py-3 font-medium">Rs. {order.total.toLocaleString()}</td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
              </td>
              <td className="px-4 py-3">
                <Link href={`/account/orders/${order._id}`} className="text-primary-600 hover:underline text-sm">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
