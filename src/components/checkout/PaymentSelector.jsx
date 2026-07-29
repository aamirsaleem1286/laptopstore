'use client';

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery (COD)', description: 'Pay when you receive your order' },
  { id: 'card', label: 'Credit / Debit Card', description: 'Pay via Stripe (Visa, Mastercard, etc.)' },
  { id: 'bank_transfer', label: 'Bank Transfer', description: 'Direct transfer to our bank account' },
  { id: 'jazzcash', label: 'JazzCash', description: 'Pay via JazzCash mobile account' },
  { id: 'easypaisa', label: 'EasyPaisa', description: 'Pay via EasyPaisa mobile account' },
];

export default function PaymentSelector({ selected, setSelected, errors }) {
  return (
    <div className="space-y-3">
      {paymentMethods.map((pm) => (
        <label key={pm.id} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${selected === pm.id ? 'border-primary-500 bg-primary-50' : 'hover:bg-gray-50'}`}>
          <input type="radio" name="payment" value={pm.id} checked={selected === pm.id} onChange={() => setSelected(pm.id)} className="text-primary-600" />
          <div>
            <p className="font-medium text-sm">{pm.label}</p>
            <p className="text-xs text-gray-500">{pm.description}</p>
          </div>
        </label>
      ))}
      {errors && <p className="text-sm text-red-500">{errors}</p>}
    </div>
  );
}
