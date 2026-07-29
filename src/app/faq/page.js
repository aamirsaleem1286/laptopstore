'use client';

import { useState } from 'react';

const faqs = [
  { q: 'Do you offer wholesale pricing?', a: 'Yes! Wholesale pricing is available for orders of 5+ units. Register a wholesale account and wait for admin approval to access bulk pricing.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery, Credit/Debit cards (via Stripe), Bank Transfer, JazzCash, and EasyPaisa.' },
  { q: 'What is the shipping cost?', a: 'Shipping is FREE for orders above Rs. 50,000. For smaller orders, a flat Rs. 500 shipping fee applies.' },
  { q: 'Do you sell used or refurbished laptops?', a: 'Yes, we clearly label all laptops as New, Used, or Refurbished. Used and refurbished units come with reduced pricing and limited warranty.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for defective items. Items must be in original condition with all accessories.' },
  { q: 'How long does delivery take?', a: 'Delivery within Lahore is same-day or next-day. Other major cities: 2-3 business days. Remote areas: 4-5 business days.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border rounded-lg">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center p-4 text-left">
              <span className="font-medium">{faq.q}</span>
              <span className="text-2xl text-gray-400">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
