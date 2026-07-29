'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineDocumentDuplicate, HiOutlineArrowDownTray, HiOutlineMagnifyingGlass } from 'react-icons/hi';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', description: '',
    retailPrice: 0, wholesalePrice: 0, wholesaleMinQty: 5,
    stock: 0, lowStockThreshold: 5, condition: 'new',
    specifications: {}, images: [], isFeatured: false, isNewArrival: false, isBestSeller: false,
  });
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${page}&limit=20&search=${search}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', brand: '', category: '', description: '',
      retailPrice: 0, wholesalePrice: 0, wholesaleMinQty: 5,
      stock: 0, lowStockThreshold: 5, condition: 'new',
      specifications: {}, images: [], isFeatured: false, isNewArrival: false, isBestSeller: false,
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category?._id || '',
      description: product.description || '',
      retailPrice: product.retailPrice || 0,
      wholesalePrice: product.wholesalePrice || 0,
      wholesaleMinQty: product.wholesaleMinQty || 5,
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 5,
      condition: product.condition || 'new',
      specifications: product.specifications || {},
      images: product.images || [],
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => { setEditingProduct(null); resetForm(); setShowForm(true); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'image', label: '', render: (row) => row.images?.[0] ? <img src={`/images/products/${row.images[0]}`} alt="" className="w-12 h-12 object-contain" /> : null },
          { key: 'name', label: 'Product' },
          { key: 'brand', label: 'Brand' },
          { key: 'category', label: 'Category', render: (row) => row.category?.name || '-' },
          { key: 'retailPrice', label: 'Retail', render: (row) => `Rs. ${row.retailPrice.toLocaleString()}` },
          { key: 'wholesalePrice', label: 'Wholesale', render: (row) => row.wholesalePrice ? `Rs. ${row.wholesalePrice.toLocaleString()}` : '-' },
          { key: 'stock', label: 'Stock', render: (row) => <span className={row.stock <= (row.lowStockThreshold || 5) ? 'text-red-600 font-medium' : ''}>{row.stock}</span> },
          { key: 'actions', label: 'Actions', render: (row) => (
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(row)} className="p-1 hover:bg-gray-100 rounded" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(row._id)} className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
            </div>
          )},
        ]}
        data={products}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingProduct(null); resetForm(); }} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Product Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Brand *</label><input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Category *</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="w-full px-3 py-2 border rounded-md"><option value="">Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Condition</label><select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full px-3 py-2 border rounded-md"><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-md" /></div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Processor</label><input type="text" value={formData.specifications?.processor || ''} onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, processor: e.target.value}})} className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">RAM</label><input type="text" value={formData.specifications?.ram || ''} onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, ram: e.target.value}})} className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">Storage</label><input type="text" value={formData.specifications?.storage || ''} onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, storage: e.target.value}})} className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">Storage Type</label><select value={formData.specifications?.storageType || ''} onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, storageType: e.target.value}})} className="w-full px-3 py-2 border rounded-md"><option value="">Select</option><option value="SSD">SSD</option><option value="NVMe">NVMe</option><option value="HDD">HDD</option></select></div>
              <div><label className="block text-sm font-medium mb-1">Display Size</label><input type="text" value={formData.specifications?.displaySize || ''} onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, displaySize: e.target.value}})} className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">GPU</label><input type="text" value={formData.specifications?.gpu || ''} onChange={(e) => setFormData({...formData, specifications: {...formData.specifications, gpu: e.target.value}})} className="w-full px-3 py-2 border rounded-md" /></div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Pricing & Stock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1">Retail Price *</label><input type="number" value={formData.retailPrice} onChange={(e) => setFormData({...formData, retailPrice: Number(e.target.value)})} required className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">Wholesale Price</label><input type="number" value={formData.wholesalePrice} onChange={(e) => setFormData({...formData, wholesalePrice: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">Min Qty for Wholesale</label><input type="number" value={formData.wholesaleMinQty} onChange={(e) => setFormData({...formData, wholesaleMinQty: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">Stock *</label><input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} required className="w-full px-3 py-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium mb-1">Low Stock Threshold</label><input type="number" value={formData.lowStockThreshold} onChange={(e) => setFormData({...formData, lowStockThreshold: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" /></div>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="rounded" /> Featured Product</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isNewArrival} onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})} className="rounded" /> New Arrival</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})} className="rounded" /> Best Seller</label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); resetForm(); }} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editingProduct ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}