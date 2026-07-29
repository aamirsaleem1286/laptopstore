'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { HiOutlineShoppingCart, HiOutlineHeart, HiStar } from 'react-icons/hi';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const stockLabel = product.stock === 0 ? 'Out of Stock' : product.stock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock';
  const stockVariant = product.stock === 0 ? 'bg-red-100 text-red-700' : product.stock <= product.lowStockThreshold ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isOutOfStock = product.stock === 0;
  const discountPercent = product.wholesalePrice ? Math.round(((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100) : 0;

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease-out',
      }}
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ transform: 'translateZ(20px)' }}
        />

        {product.images?.[0] && !imgError ? (
          <motion.img
            src={`/images/products/${product.images[0]}`}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-110"
            style={{ transform: 'translateZ(40px)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
            onError={() => setImgError(true)}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <motion.div
            className="w-full h-full flex items-center justify-center text-gray-300"
            style={{ transform: 'translateZ(40px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </motion.div>
        )}

        <motion.div
          className="absolute top-3 left-3 right-3 flex justify-between"
          style={{ transform: 'translateZ(60px)' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            {product.brand}
          </motion.span>

          {product.condition !== 'new' && (
            <motion.span
              className="bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
            </motion.span>
          )}

          {discountPercent > 0 && (
            <motion.span
              className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm"
              whileHover={{ scale: 1.1, rotate: 3 }}
            >
              -{discountPercent}%
            </motion.span>
          )}

          <motion.button
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Add to wishlist"
          >
            <HiOutlineHeart className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute bottom-3 left-3 right-3 flex justify-between items-end"
          style={{ transform: 'translateZ(60px)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating) ? 'text-yellow-400' : 'text-gray-200'}`}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 300 }}
              >
                <HiStar className="w-full h-full" />
              </motion.span>
            ))}
          </motion.div>

          <motion.span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${stockVariant} shadow-sm`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          >
            {stockLabel}
          </motion.span>
        </motion.div>
      </Link>

      <motion.div
        className="mt-4 space-y-3"
        style={{ transform: 'translateZ(20px)' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Link href={`/products/${product.slug}`} className="block">
          <motion.h3
            className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors"
            whileHover={{ x: 4 }}
          >
            {product.name}
          </motion.h3>
        </Link>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            className="text-xl font-bold text-gray-900"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            Rs. {product.retailPrice.toLocaleString()}
          </motion.span>

          {product.wholesalePrice && product.wholesalePrice < product.retailPrice && (
            <>
              <motion.span
                className="text-sm text-gray-400 line-through"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Rs. {product.retailPrice.toLocaleString()}
              </motion.span>
              <motion.span
                className="text-lg font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                Wholesale: Rs. {product.wholesalePrice.toLocaleString()}
              </motion.span>
            </>
          )}
        </motion.div>

        {product.wholesalePrice && product.wholesalePrice < product.retailPrice && (
          <motion.div
            className="text-xs text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="font-medium">Bulk savings</span>
            <span>from {product.wholesaleMinQty}+ units</span>
          </motion.div>
        )}

        <motion.div
          className="flex gap-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock) addItem(product);
            }}
            disabled={isOutOfStock}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ boxShadow: isOutOfStock ? 'none' : '0 10px 30px -10px rgba(59, 130, 246, 0.5)' }}
          >
            <HiOutlineShoppingCart className="w-4.5 h-4.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </motion.button>

          <motion.button
            className="p-3 border-2 border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Quick view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"
        style={{ transform: 'translateZ(-20px)', filter: 'blur(40px)' }}
      />
    </motion.div>
  );
}