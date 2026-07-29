'use client';

export default function OrderSummary({ items, subtotal, shipping, discount, total, loading, onPlaceOrder, buttonText = 'Place Order' }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span className="text-gray-600 truncate max-w-[200px]">
              {item.name} × {item.quantity}
            </span>
            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        {shipping > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>
            <span>Rs. {shipping.toLocaleString()}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-Rs. {discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-base border-t pt-2">
          <span>Total</span>
          <span>Rs. {total.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={loading}
        className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}
