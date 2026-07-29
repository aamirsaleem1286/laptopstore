import { NextResponse } from 'next/server';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { status, note } = await request.json();

    const orders = await query('SELECT * FROM Orders WHERE id = @id', { id: params.id });
    const order = orders[0];
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const history = order.statusHistory ? JSON.parse(order.statusHistory) : [];
    history.push({
      status,
      date: new Date().toISOString(),
      note: note || '',
      updatedBy: user.userId,
    });

    const paymentStatus = status === 'delivered' ? 'paid' : order.paymentStatus;

    await execute(
      'UPDATE Orders SET status = @status, paymentStatus = @paymentStatus, statusHistory = @history, updatedAt = GETDATE() WHERE id = @id',
      { status, paymentStatus, history: JSON.stringify(history), id: params.id }
    );

    return NextResponse.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}