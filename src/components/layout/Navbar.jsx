'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { HiOutlineMenu, HiOutlineShoppingCart, HiOutlineUser, HiOutlineSearch } from 'react-icons/hi';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Laptops' },
  { href: '/products?brand=Apple', label: 'Apple' },
  { href: '/products?brand=HP', label: 'HP' },
  { href: '/products?brand=Dell', label: 'Dell' },
  { href: '/products?brand=Lenovo', label: 'Lenovo' },
];

export default function Navbar({ onCartToggle }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user && ['admin', 'manager', 'staff'].includes(user.role);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary-600">
            LaptopStore
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Search">
              <HiOutlineSearch className="w-5 h-5" />
            </button>

            <button onClick={onCartToggle} className="p-2 hover:bg-gray-100 rounded-full relative" aria-label="Cart">
              <HiOutlineShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Account">
                  <HiOutlineUser className="w-5 h-5" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1">
                    <Link href="/account/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      Wishlist
                    </Link>
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-primary-600 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/account/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">Login</Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full" aria-label="Menu">
              <HiOutlineMenu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/products?search=${searchQuery}`; }} className="relative">
              <input
                type="text"
                placeholder="Search laptops by brand, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <HiOutlineSearch className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-3 border-t">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block px-2 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
