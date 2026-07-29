'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const [address, setAddress] = useState({
    name: user?.name || '', street: '', city: '', state: '', zip: '', country: 'Pakistan', phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const validateShipping = () => {
    const errs = {};
    if (!address.name.trim()) errs.name = 'Required';
    if (!address.phone.trim()) errs.phone = 'Required';
    if (!address.street.trim()) errs.street = 'Required';
    if (!address.city.trim()) errs.city = 'Required';
    if (!address.state.trim()) errs.state = 'Required';
    return errs;
  };

  const handlePlaceOrder = async () => {
    if (step === 1) {
      const errs = validateShipping();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        shippingAddress: address,
        paymentMethod,
        couponCode,
        items: items.map((item) => ({ _id: item._id, quantity: item.quantity })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Order failed');
        return;
      }

      clearCart();
      router.push(`/account/orders/${data.order._id}`);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="text-primary-600 hover:underline">Add items to your cart first</Link>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Review' },
  ];

  return (
    <div>
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s.num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s.num}
            </div>
            <span className={`text-sm ${step >= s.num ? 'font-medium' : 'text-gray-400'}`}>{s.label}</span>
            {i < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg p-6">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <ShippingForm address={address} setAddress={setAddress} errors={errors} savedAddresses={user?.addresses || []} onSelectSaved={(addr) => setAddress(addr)} />
                <button onClick={handlePlaceOrder} className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <PaymentSelector selected={paymentMethod} setSelected={setPaymentMethod} />
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50">Back</button>
                  <button onClick={handlePlaceOrder} className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm">Shipping To</h4>
                    <p className="text-sm text-gray-600">{address.name} - {address.phone}</p>
                    <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} {address.zip}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm">Payment Method</h4>
                    <p className="text-sm text-gray-600 capitalize">{paymentMethod.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50">Back</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <OrderSummary
            items={items}
            subtotal={totalPrice}
            shipping={totalPrice >= 50000 ? 0 : 500}
            discount={0}
            total={totalPrice + (totalPrice >= 50000 ? 0 : 500)}
            loading={submitting}
            onPlaceOrder={handlePlaceOrder}
            buttonText={step < 3 ? 'Place Order' : 'Confirm & Place Order'}
          />
        </div>
      </div>
    </div>
  );
}
