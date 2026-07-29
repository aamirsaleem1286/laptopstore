'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineRefresh } from 'react-icons/hi';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    isActive: true,
    order: 0,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/banners?id=${editing._id}` : '/api/admin/banners';
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
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', image: '', link: '', isActive: true, order: 0 });
  };

  const handleEdit = (banner) => {
    setEditing(banner);
    setFormData(banner);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Banner
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'order', label: 'Order' },
          { key: 'image', label: 'Preview', render: (row) => row.image ? <img src={row.image} alt="" className="w-20 h-12 object-cover rounded" /> : '-' },
          { key: 'title', label: 'Title' },
          { key: 'subtitle', label: 'Subtitle' },
          { key: 'link', label: 'Link' },
          { key: 'isActive', label: 'Status', render: (row) => (
            <span className={`px-2 py-1 text-xs rounded-full ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {row.isActive ? 'Active' : 'Inactive'}
            </span>
          )},
          { key: 'actions', label: 'Actions', render: (row) => (
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(row)} className="p-1 hover:bg-gray-100 rounded" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(row._id)} className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
            </div>
          )},
        ]}
        data={banners}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null); resetForm(); }} title={editing ? 'Edit Banner' : 'Add Banner'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium mb-1">Subtitle</label><input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium mb-1">Image URL *</label><input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required className="w-full px-3 py-2 border rounded-md" placeholder="https://example.com/banner.jpg" /></div>
          <div><label className="block text-sm font-medium mb-1">Link URL</label><input type="url" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="/products" /></div>
          <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded" /><label className="text-sm font-medium">Active</label></div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); resetForm(); }} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}