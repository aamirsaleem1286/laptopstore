'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import Pagination from '@/components/ui/Pagination';
import { HiOutlineViewGrid, HiOutlineViewList, HiOutlineFilter } from 'react-icons/hi';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const handleSortChange = (value) => {
    if (value === '-retailPrice') {
      setSort('retailPrice');
      setOrder('desc');
    } else if (value === 'retailPrice') {
      setSort('retailPrice');
      setOrder('asc');
    } else {
      setSort(value);
      setOrder('desc');
    }
  };

  const buildQuery = useCallback((pageNum) => {
    const params = new URLSearchParams();
    params.set('page', pageNum?.toString() || '1');
    params.set('limit', '12');
    params.set('sort', sort);
    params.set('order', order);

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (typeof value === 'object' && value !== null) {
        if (value.min) params.set('minPrice', value.min);
        if (value.max) params.set('maxPrice', value.max);
      } else {
        params.set(key, value);
      }
    });

    const search = searchParams.get('q');
    if (search) params.set('q', search);
    const brand = searchParams.get('brand');
    if (brand) params.set('brand', brand);

    return params.toString();
  }, [filters, sort, order, searchParams]);

  const fetchProducts = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?${buildQuery(pageNum)}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchProducts(1);
  }, [filters, sort, order]);

  useEffect(() => {
    const brand = searchParams.get('brand');
    if (brand) {
      setFilters((prev) => ({ ...prev, brand: [brand] }));
    }
  }, []);

  const handlePageChange = (page) => fetchProducts(page);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {searchParams.get('q') ? `Search: "${searchParams.get('q')}"` : searchParams.get('brand') ? `${searchParams.get('brand')} Laptops` : 'All Laptops'}
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex border rounded-md">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : ''}`}><HiOutlineViewGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : ''}`}><HiOutlineViewList className="w-4 h-4" /></button>
          </div>
          <select value={sort === 'retailPrice' && order === 'asc' ? 'retailPrice' : sort === 'retailPrice' && order === 'desc' ? '-retailPrice' : sort} onChange={(e) => handleSortChange(e.target.value)} className="text-sm border rounded-md px-2 py-1.5">
            <option value="createdAt">Newest</option>
            <option value="retailPrice">Price: Low to High</option>
            <option value="-retailPrice">Price: High to Low</option>
            <option value="popularity">Most Popular</option>
          </select>
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="md:hidden p-2 border rounded-md">
            <HiOutlineFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-4 overflow-y-auto">
              <ProductFilters filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
            </div>
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{pagination.total} product{pagination.total !== 1 ? 's' : ''} found</p>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-gray-100 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}

          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="flex gap-6">
          <div className="hidden md:block w-64 space-y-4">
            <div className="h-96 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-gray-100 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
