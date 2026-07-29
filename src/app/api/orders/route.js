import { NextResponse } from 'next/server';
import { dbConnect, query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import sql from '@/lib/sql';
import { getAuthUser } from '@/lib/auth';

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getAuthUser(request);
    const body = await request.json();
    const { shippingAddress, paymentMethod, couponCode } = body;

    if (!shippingAddress?.name || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.phone) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    let items = [];
    let subtotal = 0;

    if (user) {
      // Fetch from server cart
      const cart = await sql.findOne('Carts', { userId: user.userId });
      let cartItems = [];
      if (cart && cart.items) {
        cartItems = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;
      }
      if (!cart || cartItems.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      }

      for (const item of cartItems) {
        const product = await sql.findById('Products', item.productId || item.product);
        if (!product) continue;

        let price = parseFloat(product.retailPrice);
        if (
          user.role === 'wholesale_customer' &&
          user.wholesaleStatus === 'approved' &&
          product.wholesalePrice &&
          item.quantity >= product.wholesaleMinQty
        ) {
          price = parseFloat(product.wholesalePrice);
        }

        let images = product.images;
        if (typeof images === 'string') {
          try { images = JSON.parse(images); } catch { images = []; }
        }

        let specs = product.specifications;
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs); } catch { specs = {}; }
        }

        items.push({
          productId: product.id,
          name: product.name,
          image: Array.isArray(images) && images.length > 0 ? images[0] : '',
          price,
          quantity: item.quantity,
          storage: specs?.storage,
          processor: specs?.processor,
        });
      }
    } else {
      // Guest checkout from client-provided items
      if (!body.items || body.items.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      }
      for (const item of body.items) {
        const product = await sql.findById('Products', item._id || item.productId);
        if (!product) continue;

        let images = product.images;
        if (typeof images === 'string') {
          try { images = JSON.parse(images); } catch { images = []; }
        }

        items.push({
          productId: product.id,
          name: product.name,
          image: Array.isArray(images) && images.length > 0 ? images[0] : '',
          price: parseFloat(product.retailPrice),
          quantity: item.quantity,
        });
      }
    }

    if (items.length === 0) {
      return NextResponse.json({ error: 'No valid items in cart' }, { status: 400 });
    }

    subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await sql.findOne('Coupons', { code: couponCode.toUpperCase() });
      if (
        coupon &&
        coupon.isActive &&
        new Date(coupon.expiresAt) >= new Date() &&
        coupon.usedCount < coupon.maxUses &&
        subtotal >= parseFloat(coupon.minOrderAmount || 0)
      ) {
        if (coupon.type === 'percentage') {
          discount = (subtotal * parseFloat(coupon.value)) / 100;
        } else {
          discount = Math.min(parseFloat(coupon.value), subtotal);
        }
        // Increment used count
        await sql.update('Coupons', coupon.id, {
          usedCount: (coupon.usedCount || 0) + 1,
        });
      }
    }

    const shippingCost = subtotal >= 50000 ? 0 : 500;
    const tax = 0; // Simplified for MVP
    const total = subtotal - discount + shippingCost + tax;

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    const orderData = {
      id: uuidv4(),
      userId: user?.userId || null,
      guestEmail: body.guestEmail || null,
      orderNumber,
      items: JSON.stringify(items),
      shippingAddress: JSON.stringify(shippingAddress),
      billingAddress: JSON.stringify(shippingAddress),
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'card' ? 'pending' : 'pending',
      subtotal,
      discount,
      couponCode: couponCode?.toUpperCase() || null,
      shippingCost,
      tax,
      total,
      currency: 'PKR',
      status: 'pending',
      statusHistory: JSON.stringify([{ status: 'pending', date: new Date().toISOString(), note: 'Order placed' }]),
    };

    await sql.create('Orders', orderData);

    // Update stock
    for (const item of items) {
      await query(
        'UPDATE Products SET stock = stock - @qty WHERE id = @id',
        { qty: item.quantity, id: item.productId }
      );
    }

    // Clear user's cart
    if (user) {
      await query(
        'UPDATE Carts SET items = @items, couponCode = NULL, discount = 0 WHERE userId = @userId',
        { items: '[]', userId: user.userId }
      );
    }

    // Fetch the created order
    const createdOrder = await sql.findById('Orders', orderData.id);

    return NextResponse.json({ message: 'Order placed successfully', order: createdOrder }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    const orders = await sql.findAll('Orders', { userId: user.userId }, { sort: { createdAt: -1 } });

    // Parse JSON fields
    const parsed = orders.map((o) => {
      if (o.items && typeof o.items === 'string') o.items = JSON.parse(o.items);
      if (o.shippingAddress && typeof o.shippingAddress === 'string') o.shippingAddress = JSON.parse(o.shippingAddress);
      if (o.statusHistory && typeof o.statusHistory === 'string') o.statusHistory = JSON.parse(o.statusHistory);
      return o;
    });

    return NextResponse.json({ orders: parsed });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}