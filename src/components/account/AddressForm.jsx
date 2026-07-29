'use client';

import { useState } from 'react';

export default function AddressForm({ address, setAddress, onSave, onCancel }) {
  const handleChange = (field) => (e) => setAddress({ ...address, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Address Label</label>
          <input type="text" value={address.label} onChange={handleChange('label')} placeholder="Home, Office, etc." className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" value={address.phone} onChange={handleChange('phone')} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Street Address</label>
        <input type="text" value={address.street} onChange={handleChange('street')} className="w-full px-3 py-2 border rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input type="text" value={address.city} onChange={handleChange('city')} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input type="text" value={address.state} onChange={handleChange('state')} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ZIP</label>
          <input type="text" value={address.zip} onChange={handleChange('zip')} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input type="text" value={address.country} onChange={handleChange('country')} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={address.isDefault} onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })} className="rounded border-gray-300" />
            <span className="text-sm">Set as default</span>
          </label>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && <button onClick={onCancel} className="px-4 py-2 border rounded-md text-sm">Cancel</button>}
        <button onClick={onSave} className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700">Save Address</button>
      </div>
    </div>
  );
}
