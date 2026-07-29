import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import sql from '@/lib/sql';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    const order = await sql.findOne('Orders', { id: params.id, userId: user.userId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Parse JSON fields
    if (order.items && typeof order.items === 'string') order.items = JSON.parse(order.items);
    if (order.shippingAddress && typeof order.shippingAddress === 'string') order.shippingAddress = JSON.parse(order.shippingAddress);
    if (order.statusHistory && typeof order.statusHistory === 'string') order.statusHistory = JSON.parse(order.statusHistory);

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}