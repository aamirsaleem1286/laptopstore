'use client';

import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="w-20 h-20 bg-gray-50 rounded flex-shrink-0">
        {item.image && (
          <img src={`/images/products/${item.image}`} alt={item.name} className="w-full h-full object-contain p-2" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Rs. {item.price.toLocaleString()}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border rounded">
            <button onClick={() => onUpdateQuantity(item._id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100">
              <HiOutlineMinus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-sm">{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100">
              <HiOutlinePlus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={() => onRemove(item._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded">
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
      </div>
    </div>
  );
}
