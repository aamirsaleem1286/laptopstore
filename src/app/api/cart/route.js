import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import sql from '@/lib/sql';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ items: [], subtotal: 0 });
    }

    await dbConnect();
    let cart = await sql.findOne('Carts', { userId: user.userId });

    let cartItems = [];
    if (cart && cart.items) {
      cartItems = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;
    }

    // Resolve product details for each item
    const items = [];
    for (const item of cartItems) {
      const product = await sql.findById('Products', item.productId || item.product);
      if (!product) continue;

      let price = parseFloat(product.retailPrice);
      let images = product.images;
      if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch { images = []; }
      }

      if (
        user.role === 'wholesale_customer' &&
        user.wholesaleStatus === 'approved' &&
        product.wholesalePrice &&
        item.quantity >= product.wholesaleMinQty
      ) {
        price = parseFloat(product.wholesalePrice);
      }

      items.push({
        _id: product.id,
        name: product.name,
        image: Array.isArray(images) && images.length > 0 ? images[0] : '',
        price,
        quantity: item.quantity,
        stock: product.stock || 0,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      items,
      subtotal,
      couponCode: cart?.couponCode || null,
      discount: cart?.discount || 0,
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}