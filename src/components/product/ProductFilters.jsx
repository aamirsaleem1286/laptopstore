'use client';

import { useState } from 'react';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';

const brands = ['Apple', 'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Samsung'];
const processors = ['i3', 'i5', 'i7', 'i9', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9', 'M1', 'M2', 'M3'];
const rams = ['4GB', '8GB', '16GB', '32GB', '64GB'];
const storageTypes = ['SSD', 'NVMe', 'HDD'];
const conditions = ['new', 'used', 'refurbished'];

export default function ProductFilters({ filters, setFilters, onClose }) {
  const [priceRange, setPriceRange] = useState(filters.priceRange || { min: '', max: '' });

  const toggleFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFilters({ ...filters, [key]: updated });
  };

  const handlePriceChange = () => {
    setFilters({ ...filters, priceRange });
  };

  const clearAll = () => {
    setFilters({});
    setPriceRange({ min: '', max: '' });
  };

  const FilterSection = ({ title, options, filterKey }) => (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(filters[filterKey] || []).includes(option)}
              onChange={() => toggleFilter(filterKey, option)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2"><HiOutlineAdjustments /> Filters</h3>
        <div className="flex gap-2">
          <button onClick={clearAll} className="text-xs text-primary-600 hover:underline">Clear All</button>
          {onClose && <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><HiOutlineX className="w-4 h-4" /></button>}
        </div>
      </div>

      <FilterSection title="Brand" options={brands} filterKey="brand" />

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h4>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm" />
          <span className="text-gray-400">-</span>
          <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} className="w-full px-2 py-1.5 border rounded text-sm" />
          <button onClick={handlePriceChange} className="px-2 py-1.5 bg-gray-100 rounded text-sm">Go</button>
        </div>
      </div>

      <FilterSection title="Processor" options={processors} filterKey="processor" />
      <FilterSection title="RAM" options={rams} filterKey="ram" />
      <FilterSection title="Storage Type" options={storageTypes} filterKey="storageType" />
      <FilterSection title="Condition" options={conditions} filterKey="condition" />
    </div>
  );
}
