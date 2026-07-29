'use client';

import { useState } from 'react';

export default function CouponInput({ onApply, appliedCode, discount, loading }) {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim().toUpperCase());
    }
  };

  if (appliedCode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-700">
          Coupon <strong>{appliedCode}</strong> applied! Discount: Rs. {discount.toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter coupon code"
        className="flex-1 px-3 py-2 border rounded-md text-sm uppercase"
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      <button onClick={handleApply} disabled={loading || !code.trim()} className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 disabled:opacity-50">
        {loading ? '...' : 'Apply'}
      </button>
    </div>
  );
}
