'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineRefresh, HiOutlineSearch } from 'react-icons/hi';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxUses: 100,
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [genInput, setGenInput] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/coupons?id=${editing._id}` : '/api/admin/coupons';
    const method = editing ? 'PUT' : 'POST';
    const payload = editing ? { _id: editing._id, ...formData } : formData;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        resetForm();
        fetchCoupons();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save coupon');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '', description: '', discountType: 'percentage',
      value: 10, minOrderAmount: 0, maxUses: 100,
      startDate: '', endDate: '', isActive: true,
    });
    setGenInput('');
  };

  const handleEdit = (coupon) => {
    setEditing(coupon);
    setFormData({
      code: coupon.code || '',
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      value: coupon.value || 0,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxUses: coupon.maxUses || 100,
      startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
      endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
      isActive: coupon.isActive !== false,
    });
    setGenInput(coupon.code || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const generateCode = () => {
    const clean = genInput.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setGenInput(clean);
    setFormData({ ...formData, code: clean });
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  const filtered = coupons.filter((c) =>
    !search || c.code?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => { setEditing(null); resetForm(); setShowForm(true); }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-5 h-5" /> Add Coupon
        </button>
      </div>

      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coupons..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
        />
      </div>

      <DataTable
        columns={[
          { key: 'code', label: 'Code', render: (row) => <span className="font-mono font-medium">{row.code}</span> },
          { key: 'description', label: 'Description' },
          { key: 'discountType', label: 'Type', render: (row) => row.discountType === 'percentage' ? '% Off' : 'Fixed' },
          { key: 'value', label: 'Value', render: (row) => row.discountType === 'fixed' ? `Rs. ${row.value}` : `${row.value}%` },
          { key: 'minOrderAmount', label: 'Min Order', render: (row) => `Rs. ${(row.minOrderAmount || 0).toLocaleString()}` },
          { key: 'maxUses', label: 'Max Uses', render: (row) => row.maxUses || '∞' },
          { key: 'usedCount', label: 'Used', render: (row) => row.usedCount || 0 },
          { key: 'isActive', label: 'Status', render: (row) => (
            <span className={`px-2 py-1 text-xs rounded-full ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {row.isActive ? 'Active' : 'Inactive'}
            </span>
          )},
          { key: 'actions', label: '', render: (row) => (
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(row)} className="p-1 hover:bg-gray-100 rounded" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(row._id)} className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
            </div>
          )},
        ]}
        data={filtered}
        loading={loading}
      />

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null); resetForm(); }} title={editing ? 'Edit Coupon' : 'Add Coupon'}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              placeholder="e.g., SAVE10"
              className="w-full px-3 py-2 border rounded-md font-mono uppercase"
            />
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={genInput}
                onChange={(e) => setGenInput(e.target.value)}
                placeholder="Type to generate..."
                className="flex-1 px-3 py-1.5 border rounded-md text-sm"
              />
              <button type="button" onClick={generateCode} className="px-3 py-1.5 bg-gray-100 text-sm rounded-md hover:bg-gray-200">
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Free shipping on orders over Rs. 50,000" className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Value * {formData.discountType === 'percentage' ? '(e.g., 10 for 10%)' : '(e.g., 500 for Rs. 500 off)'}
              </label>
              <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} required min="0" className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Order Amount (Rs.)</label>
              <input type="number" value={formData.minOrderAmount} onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })} min="0" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Uses</label>
              <input type="number" value={formData.maxUses} onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })} min="0" className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
            <span className="text-sm font-medium">Active</span>
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); resetForm(); }} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}