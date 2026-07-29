'use client';

import Link from 'next/link';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">LaptopStore</h3>
            <p className="text-sm text-gray-400">Pakistan&apos;s trusted source for quality laptops — retail and wholesale.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/warranty" className="hover:text-white">Warranty & Returns</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-3">Brands</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?brand=Apple" className="hover:text-white">Apple</Link></li>
              <li><Link href="/products?brand=HP" className="hover:text-white">HP</Link></li>
              <li><Link href="/products?brand=Dell" className="hover:text-white">Dell</Link></li>
              <li><Link href="/products?brand=Lenovo" className="hover:text-white">Lenovo</Link></li>
              <li><Link href="/products?brand=Asus" className="hover:text-white">Asus</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><HiOutlineLocationMarker className="w-4 h-4" /> Lahore, Pakistan</li>
              <li className="flex items-center gap-2"><HiOutlinePhone className="w-4 h-4" /> +92 300 1234567</li>
              <li className="flex items-center gap-2"><HiOutlineMail className="w-4 h-4" /> info@laptopstore.pk</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LaptopStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
