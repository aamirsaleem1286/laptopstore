'use client';

import { useState } from 'react';

export default function ShippingForm({ address, setAddress, errors, savedAddresses = [], onSelectSaved }) {
  const handleChange = (field) => (e) => setAddress({ ...address, [field]: e.target.value });

  return (
    <div className="space-y-4">
      {savedAddresses.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Saved Addresses</label>
          <div className="space-y-2">
            {savedAddresses.map((addr, i) => (
              <button key={i} type="button" onClick={() => onSelectSaved(addr)} className="w-full text-left p-3 border rounded-md hover:bg-gray-50 text-sm">
                {addr.label && <span className="font-medium">{addr.label}: </span>}
                {addr.street}, {addr.city}, {addr.state} - {addr.zip}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input type="text" value={address.name} onChange={handleChange('name')} className="w-full px-3 py-2 border rounded-md" />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input type="tel" value={address.phone} onChange={handleChange('phone')} className="w-full px-3 py-2 border rounded-md" />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street Address *</label>
        <input type="text" value={address.street} onChange={handleChange('street')} className="w-full px-3 py-2 border rounded-md" />
        {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <input type="text" value={address.city} onChange={handleChange('city')} className="w-full px-3 py-2 border rounded-md" />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State/Province *</label>
          <input type="text" value={address.state} onChange={handleChange('state')} className="w-full px-3 py-2 border rounded-md" />
          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code</label>
          <input type="text" value={address.zip} onChange={handleChange('zip')} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <input type="text" value={address.country} onChange={handleChange('country')} className="w-full px-3 py-2 border rounded-md" />
      </div>
    </div>
  );
}
