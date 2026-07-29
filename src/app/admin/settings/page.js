'use client';

import { useState, useEffect } from 'react';
import { HiOutlineCog, HiOutlineCurrencyDollar, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineBell } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    storeName: 'LaptopStore',
    storeEmail: 'contact@laptopstore.pk',
    storePhone: '+92 300 1234567',
    storeAddress: '123 Tech Street, Lahore, Pakistan',
    currency: 'PKR',
    taxRate: 0,
    freeShippingThreshold: 50000,
    flatShippingRate: 500,
    minOrderAmount: 0,
    enableWholesale: true,
    wholesaleMinQty: 5,
    maintenanceMode: false,
    allowGuestCheckout: true,
    emailNotifications: true,
    smsNotifications: false,
    orderConfirmationEmail: true,
    shippingUpdateEmail: true,
    newOrderEmail: true,
    lowStockAlert: true,
    lowStockThreshold: 5,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      alert('Settings saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading settings...</div>;

  const tabs = [
    { id: 'general', label: 'General', icon: HiOutlineCog },
    { id: 'shipping', label: 'Shipping', icon: HiOutlineTruck },
    { id: 'payments', label: 'Payments', icon: HiOutlineCurrencyDollar },
    { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
    { id: 'security', label: 'Security', icon: HiOutlineShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white shadow text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border rounded-xl p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold">Store Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Store Email</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Store Phone</label>
                <input
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="PKR">PKR - Pakistani Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Wholesale Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Wholesale</p>
                    <p className="text-sm text-gray-500">Allow wholesale pricing for approved customers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableWholesale}
                    onChange={(e) => setSettings({ ...settings, enableWholesale: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Quantity for Wholesale</label>
                  <input
                    type="number"
                    value={settings.wholesaleMinQty}
                    onChange={(e) => setSettings({ ...settings, wholesaleMinQty: Number(e.target.value) })}
                    min="1"
                    className="w-full md:w-1/3 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Maintenance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">Put the store in maintenance mode (admins still have access)</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Guest Checkout</p>
                  <p className="text-sm text-gray-500">Allow customers to checkout without creating an account</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowGuestCheckout}
                  onChange={(e) => setSettings({ ...settings, allowGuestCheckout: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Shipping Settings */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold">Shipping Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Free Shipping Threshold</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 50000"
                  />
                  <span className="text-gray-500">Rs.</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Flat Shipping Rate</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.flatShippingRate}
                    onChange={(e) => setSettings({ ...settings, flatShippingRate: Number(e.target.value) })}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 500"
                  />
                  <span className="text-gray-500">Rs.</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Order Amount</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 0"
                  />
                  <span className="text-gray-500">Rs.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Settings */}
        {activeTab === 'payments' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold">Payment Configuration</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Stripe Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Configure Stripe keys in your .env.local file:</p>
              <div className="space-y-2 text-sm font-mono text-gray-700 bg-gray-100 p-3 rounded">
                <div>STRIPE_SECRET_KEY=sk_test_...</div>
                <div>STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
                <div>STRIPE_WEBHOOK_SECRET=whsec_...</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Supported Payment Methods</h3>
              <div className="space-y-2">
                {['Card (Stripe)', 'Cash on Delivery', 'Bank Transfer', 'JazzCash', 'EasyPaisa'].map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold">Email & SMS Notifications</h2>

            <div className="space-y-4">
              <h3 className="font-medium">Email Notifications</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Enable Email Notifications', desc: 'Send emails for order updates' },
                  { key: 'orderConfirmationEmail', label: 'Order Confirmation', desc: 'Email customer when order is placed' },
                  { key: 'shippingUpdateEmail', label: 'Shipping Updates', desc: 'Email customer when order ships/delivers' },
                  { key: 'newOrderEmail', label: 'New Order Alerts (Admin)', desc: 'Notify admin when new order received' },
                  { key: 'lowStockAlert', label: 'Low Stock Alerts', desc: 'Email admin when product stock is low' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="font-medium">SMS Notifications (Twilio)</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable SMS Notifications</p>
                    <p className="text-sm text-gray-500">Send SMS for order updates (requires Twilio)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Twilio Account SID</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="AC..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twilio Auth Token</label>
                    <input type="password" className="w-full px-3 py-2 border rounded-md" placeholder="****" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twilio Phone Number</label>
                    <input type="tel" className="w-full px-3 py-2 border rounded-md" placeholder="+1..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold">Security Settings</h2>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Admin Access</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm">Require 2FA for admin login</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm">Log all admin actions (audit trail)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm">Auto-lock account after failed attempts</span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Session Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                  <input type="number" value="15" className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Remember Me Duration (days)</label>
                  <input type="number" value="7" className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Password Policy</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm">Minimum 8 characters</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm">Require uppercase letter</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm">Require number</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600" />
                  <span className="text-sm">Require special character</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}