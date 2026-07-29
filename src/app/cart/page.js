'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CouponInput from '@/components/cart/CouponInput';
import { useState } from 'react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (code) => {
    setCouponLoading(true);
    // Coupon validation happens server-side at order creation
    setCouponCode(code);
    setCouponLoading(false);
  };

  const shipping = totalPrice >= 50000 ? 0 : 500;
  const grandTotal = totalPrice - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any products yet.</p>
        <Link href="/products" className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItem key={item._id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
          ))}
          <div className="flex justify-between pt-3">
            <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
            <Link href="/products" className="text-sm text-primary-600 hover:underline">Continue Shopping</Link>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <CouponInput onApply={handleApplyCoupon} appliedCode={couponCode} discount={discount} loading={couponLoading} />

            <div className="flex justify-between pt-3">
              <span className="text-gray-500">Subtotal</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base border-t pt-2">
              <span>Total</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 mt-6"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
