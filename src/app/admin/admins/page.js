'use client';

import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineShieldCheck, HiOutlineUser } from 'react-icons/hi';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';

const roleColors = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-purple-100 text-purple-700',
  staff: 'bg-blue-100 text-blue-700',
};

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    phone: '',
    isActive: true,
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admins');
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!editing && !formData.password) {
      alert('Password is required for new admins');
      return;
    }

    const url = editing ? `/api/admin/admins?id=${editing._id}` : '/api/admin/admins';
    const method = editing ? 'PUT' : 'POST';
    const payload = editing
      ? { _id: editing._id, ...formData, password: formData.password || undefined }
      : formData;

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
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'staff', phone: '', isActive: true });
    setConfirmPassword('');
  };

  const handleEdit = (admin) => {
    setEditing(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      role: admin.role || 'staff',
      phone: admin.phone || '',
      isActive: admin.isBlocked !== true,
    });
    setConfirmPassword('');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this admin user?')) return;
    try {
      await fetch(`/api/admin/admins?id=${id}`, { method: 'DELETE' });
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      await fetch(`/api/admin/admins/${id}/block`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: !isBlocked }),
      });
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Admin
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role', render: (row) => (
            <span className={`px-2 py-1 text-xs rounded-full ${roleColors[row.role] || 'bg-gray-100 text-gray-700'}`}>
              {row.role}
            </span>
          )},
          { key: 'phone', label: 'Phone' },
          { key: 'status', label: 'Status', render: (row) => row.isBlocked ? (
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Blocked</span>
          ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
          )},
          { key: 'lastLogin', label: 'Last Login', render: (row) => row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never' },
          { key: 'actions', label: 'Actions', render: (row) => (
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(row)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
                <HiOutlinePencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleToggleBlock(row._id, row.isBlocked)} className={`p-1 hover:bg-gray-100 rounded ${row.isBlocked ? 'text-green-600' : 'text-red-600'}`} title={row.isBlocked ? 'Unblock' : 'Block'}>
                <HiOutlineShieldCheck className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(row._id)} className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete">
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          )},
        ]}
        data={admins}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null); resetForm(); }} title={editing ? 'Edit Admin' : 'Add Admin'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required className="w-full px-3 py-2 border rounded-md">
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Password {editing ? '(leave blank to keep current)' : '*'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editing} className="w-full px-3 py-2 border rounded-md" placeholder={editing ? 'Leave blank to keep current' : 'Enter password'} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={!editing} className="w-full px-3 py-2 border rounded-md" placeholder="Confirm password" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded" />
            <label className="text-sm font-medium">Active</label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); resetForm(); }} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}