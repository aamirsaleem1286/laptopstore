'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductGrid from '@/components/product/ProductGrid';
import { HiArrowRight, HiChevronDown } from 'react-icons/hi';
import {
  ShoppingBag, Sparkles, ShieldCheck, Truck,
  Monitor, Smartphone, Headphones, Cpu, HardDrive,
} from 'lucide-react';

const brands = [
  { name: 'Apple', image: '/images/brands/apple.svg', color: 'bg-gray-900' },
  { name: 'HP', image: '/images/brands/hp.svg', color: 'bg-blue-800' },
  { name: 'Dell', image: '/images/brands/dell.svg', color: 'bg-blue-600' },
  { name: 'Lenovo', image: '/images/brands/lenovo.svg', color: 'bg-red-600' },
  { name: 'Asus', image: '/images/brands/asus.svg', color: 'bg-gray-700' },
  { name: 'Acer', image: '/images/brands/acer.svg', color: 'bg-green-600' },
];

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above Rs. 50,000 across Pakistan' },
  { icon: ShieldCheck, title: '1 Year Warranty', desc: 'Official brand warranty on all products' },
  { icon: Sparkles, title: 'Certified Refurbished', desc: 'Professionally tested & quality assured' },
  { icon: ShoppingBag, title: 'Wholesale Pricing', desc: 'Special bulk discounts from 5+ units' },
];

const floatingLaptops = [
  { icon: Monitor, color: 'text-blue-500', size: 40, x: '10%', y: '15%', delay: 0 },
  { icon: Smartphone, color: 'text-purple-400', size: 32, x: '85%', y: '25%', delay: 1 },
  { icon: Headphones, color: 'text-green-400', size: 28, x: '20%', y: '70%', delay: 2 },
  { icon: Cpu, color: 'text-orange-400', size: 36, x: '80%', y: '75%', delay: 0.5 },
  { icon: HardDrive, color: 'text-cyan-400', size: 30, x: '50%', y: '10%', delay: 1.5 },
];

const stats = [
  { label: 'Products', value: '500+' },
  { label: 'Happy Customers', value: '10K+' },
  { label: 'Brands', value: '20+' },
  { label: 'Cities Covered', value: '50+' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          fetch('/api/products/featured'),
          fetch('/api/products?limit=8&sort=createdAt'),
        ]);
        const featuredData = await featuredRes.json();
        const newData = await newRes.json();
        setFeatured(featuredData.products || []);
        setNewArrivals(newData.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setDataReady(true);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <div className="overflow-hidden">
      {/* ========== 3D HERO SECTION ========== */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-primary-900 to-indigo-900 overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 50, 0],
            y: [0, 30, -50, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating tech icons */}
        {floatingLaptops.map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.color}`}
            style={{ left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            <item.icon size={item.size} />
          </motion.div>
        ))}

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale, transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 text-sm px-4 py-2 rounded-full mb-8 border border-white/10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Pakistan&apos;s #1 Laptop Wholesale Platform</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight"
            style={{ transform: 'translateZ(80px)' }}
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            Premium Laptops
            <br />
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Wholesale Prices
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ transform: 'translateZ(40px)' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            From bulk orders for your business to premium laptops for your team —
            we deliver the best tech at prices that work for you.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ transform: 'translateZ(60px)' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:bg-gray-100 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
                <HiArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Contact Sales
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="text-center"
              >
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1, type: 'spring' }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <HiChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </motion.section>

      {/* ========== FEATURES STRIP ========== */}
      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feat.icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== BRAND SECTION ========== */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Brand</h2>
            <p className="text-gray-500">Find laptops from all major brands at wholesale prices</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {brands.map((brand, i) => (
              <motion.div key={brand.name} variants={itemVariants} whileHover={{ y: -8, scale: 1.03 }}>
                <Link
                  href={`/products?brand=${brand.name}`}
                  className={`${brand.color} text-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all block group`}
                >
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {brand.name === 'Apple' ? '🍎' :
                     brand.name === 'HP' ? '💻' :
                     brand.name === 'Dell' ? '🖥️' :
                     brand.name === 'Lenovo' ? '📱' :
                     brand.name === 'Asus' ? '🎮' : '⚡'}
                  </motion.div>
                  <h3 className="font-semibold text-lg group-hover:scale-105 transition-transform">
                    {brand.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== FEATURED PRODUCTS ========== */}
      {featured.length > 0 && (
        <motion.section
          className="py-16 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Laptops</h2>
                <p className="text-gray-500 mt-1">Our top picks for you</p>
              </div>
              <motion.div whileHover={{ x: 5 }}>
                <Link href="/products?sort=popularity" className="text-primary-600 hover:underline font-medium inline-flex items-center gap-1">
                  View All <HiArrowRight />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <ProductGrid products={featured} />
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ========== NEW ARRIVALS ========== */}
      {newArrivals.length > 0 && (
        <motion.section
          className="py-16 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                <p className="text-gray-500 mt-1">Latest additions to our inventory</p>
              </div>
              <motion.div whileHover={{ x: 5 }}>
                <Link href="/products?sort=createdAt&order=desc" className="text-primary-600 hover:underline font-medium inline-flex items-center gap-1">
                  View All <HiArrowRight />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <ProductGrid products={newArrivals} />
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ========== CTA BANNER ========== */}
      <motion.section
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800" />
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.h2
            className="text-3xl sm:text-5xl font-bold text-white mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to Scale Your Business?
          </motion.h2>
          <motion.p
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of businesses across Pakistan getting premium laptops at wholesale rates.
            Bulk orders, nationwide delivery, and dedicated support.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:bg-gray-100 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Talk to Sales
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== NEWSLETTER ========== */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            Stay Updated
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Get notified about new arrivals, deals, and exclusive offers.
          </motion.p>
          <motion.form
            onSubmit={async (e) => { e.preventDefault(); alert('Subscribed! (Feature coming soon)'); }}
            className="flex gap-2 max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
            />
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </motion.form>
        </div>
      </motion.section>
    </div>
  );
}
