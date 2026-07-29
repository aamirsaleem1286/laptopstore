import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect } from '@/lib/db';
import sql from '@/lib/sql';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    const product = await sql.findById('Products', params.productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { quantity = 1 } = await request.json().catch(() => ({}));
    let cart = await sql.findOne('Carts', { userId: user.userId });

    let cartItems = [];
    if (cart && cart.items) {
      cartItems = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;
    }

    const existingIndex = cartItems.findIndex(
      (item) => (item.productId || item.product) === params.productId
    );

    if (existingIndex >= 0) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push({
        productId: product.id,
        quantity,
        price: parseFloat(product.retailPrice),
      });
    }

    if (cart) {
      await sql.update('Carts', cart.id, { items: JSON.stringify(cartItems) });
    } else {
      await sql.create('Carts', {
        userId: user.userId,
        items: JSON.stringify(cartItems),
      });
    }

    return NextResponse.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    const { quantity } = await request.json();

    const cart = await sql.findOne('Carts', { userId: user.userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    let cartItems = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;
    const itemIndex = cartItems.findIndex(
      (i) => (i.productId || i.product) === params.productId
    );

    if (itemIndex < 0) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    if (quantity < 1) {
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = quantity;
    }

    await sql.update('Carts', cart.id, { items: JSON.stringify(cartItems) });

    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    const cart = await sql.findOne('Carts', { userId: user.userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    let cartItems = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;
    cartItems = cartItems.filter(
      (item) => (item.productId || item.product) !== params.productId
    );

    await sql.update('Carts', cart.id, { items: JSON.stringify(cartItems) });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Cart remove error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}