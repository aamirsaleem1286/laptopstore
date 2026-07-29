'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductGallery from '@/components/product/ProductGallery';
import SpecTable from '@/components/product/SpecTable';
import ReviewList from '@/components/product/ReviewList';
import ProductGrid from '@/components/product/ProductGrid';
import Badge from '@/components/ui/Badge';
import { HiOutlineShoppingCart, HiOutlineHeart, HiStar, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          // Fetch related products
          const relatedRes = await fetch(`/api/products?brand=${data.product.brand}&limit=4`);
          const relatedData = await relatedRes.json();
          setRelated((relatedData.products || []).filter((p) => p._id !== data.product._id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const isWholesaleApplicable =
    user?.role === 'wholesale_customer' &&
    user?.wholesaleStatus === 'approved' &&
    product?.wholesalePrice &&
    quantity >= (product?.wholesaleMinQty || 5);

  const displayPrice = isWholesaleApplicable ? product.wholesalePrice : product?.retailPrice || 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-6 bg-gray-100 rounded w-1/3" />
            <div className="h-10 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <Link href="/products" className="text-primary-600 hover:underline">Back to Products</Link>
      </div>
    );
  }

  const stockStatus = product.stock === 0 ? 'Out of Stock' : product.stock <= (product.lowStockThreshold || 5) ? 'Low Stock' : 'In Stock';
  const stockVariant = product.stock === 0 ? 'danger' : product.stock <= (product.lowStockThreshold || 5) ? 'warning' : 'success';

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 flex gap-2">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <ProductGallery images={product.images} />

        {/* Product Info */}
        <div>
          <p className="text-sm text-primary-600 font-medium uppercase">{product.brand}</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <HiStar key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating) ? 'fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.numReviews})</span>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">Rs. {displayPrice.toLocaleString()}</p>
            {product.wholesalePrice && (
              <p className="text-sm text-gray-500 mt-1">
                Wholesale: Rs. {product.wholesalePrice.toLocaleString()} (min. {product.wholesaleMinQty} units)
              </p>
            )}
          </div>

          <div className="mt-4">
            <Badge variant={stockVariant}>{stockStatus}</Badge>
            {product.condition !== 'new' && (
              <Badge variant="default" className="ml-2 capitalize">{product.condition}</Badge>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                  <HiOutlineMinus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>
              {product.wholesaleMinQty && (
                <span className="text-xs text-gray-500">Bulk price at {product.wholesaleMinQty}+</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stock === 0}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <HiOutlineShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50">
              <HiOutlineHeart className="w-5 h-5" />
            </button>
          </div>

          {/* Brief specs */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Quick Specs</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {product.specifications?.processor && <div><span className="text-gray-500">Processor:</span> {product.specifications.processor}</div>}
              {product.specifications?.ram && <div><span className="text-gray-500">RAM:</span> {product.specifications.ram}</div>}
              {product.specifications?.storage && <div><span className="text-gray-500">Storage:</span> {product.specifications.storage}</div>}
              {product.specifications?.displaySize && <div><span className="text-gray-500">Display:</span> {product.specifications.displaySize}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Full Specs Table */}
      <section>
        <h2 className="text-xl font-bold mb-4">Specifications</h2>
        <SpecTable specifications={product.specifications} />
      </section>

      {/* Description */}
      {product.description && (
        <section>
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</div>
        </section>
      )}

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        <ReviewList
          reviews={reviews}
          productId={product._id}
          onSubmitReview={async (data) => {
            const res = await fetch(`/api/products/${slug}/reviews`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            if (res.ok) {
              const updated = await fetch(`/api/products/${slug}/reviews`);
              const reviewsData = await updated.json();
              setReviews(reviewsData.reviews || []);
            }
          }}
          isAuthenticated={!!user}
        />
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
