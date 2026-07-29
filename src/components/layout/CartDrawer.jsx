'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Cart ({totalItems})</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-140px)] overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="mb-4">Your cart is empty</p>
              <Link href="/products" onClick={onClose} className="text-primary-600 hover:underline">Browse Products</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 p-3 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                    {item.image && <img src={`/images/products/${item.image}`} alt={item.name} className="w-full h-full object-cover rounded" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.name}</h4>
                    <p className="text-sm text-gray-500">Rs. {item.price?.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:bg-gray-100 rounded">
                        <HiOutlineMinus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded">
                        <HiOutlinePlus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item._id)} className="ml-auto p-1 hover:bg-red-50 rounded text-red-400">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-primary-600">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 font-medium"
            >
              Checkout
            </Link>
            <button onClick={clearCart} className="w-full text-center text-sm text-gray-500 mt-2 hover:text-red-500">Clear Cart</button>
          </div>
        )}
      </div>
    </>
  );
}
