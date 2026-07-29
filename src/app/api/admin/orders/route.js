import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;
    const statusFilter = searchParams.get('status');

    let whereClause = '';
    const params = { skip, limit };
    if (statusFilter && statusFilter !== 'all') {
      whereClause = 'WHERE o.status = @status';
      params.status = statusFilter;
    }

    const [orders, countRes] = await Promise.all([
      query(
        `SELECT o.*, u.name as userName, u.email as userEmail FROM Orders o LEFT JOIN Users u ON o.userId = u.id ${whereClause} ORDER BY o.createdAt DESC OFFSET @skip ROWS FETCH NEXT @limit ROWS ONLY`,
        params
      ),
      query(`SELECT COUNT(*) as count FROM Orders o ${whereClause}`, params),
    ]);

    const parsed = orders.map(o => ({
      ...o,
      items: o.items ? JSON.parse(o.items) : [],
      shippingAddress: o.shippingAddress ? JSON.parse(o.shippingAddress) : {},
      billingAddress: o.billingAddress ? JSON.parse(o.billingAddress) : {},
      user: o.userId ? { name: o.userName, email: o.userEmail } : null,
    }));

    return NextResponse.json({
      orders: parsed,
      pagination: { page, limit, total: countRes[0]?.count || 0, pages: Math.ceil((countRes[0]?.count || 0) / limit) },
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}