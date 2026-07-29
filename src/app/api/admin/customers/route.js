import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');
    const roleFilter = searchParams.get('role');
    const blocked = searchParams.get('blocked');

    const conditions = ["role IN ('customer', 'wholesale_customer')"];
    const params = { skip, limit };

    if (search) {
      conditions.push('(name LIKE @search OR email LIKE @search OR businessName LIKE @search)');
      params.search = `%${search}%`;
    }
    if (roleFilter) {
      conditions.push('role = @role');
      params.role = roleFilter;
    }
    if (blocked === 'true') {
      conditions.push('isBlocked = 1');
    }

    const whereClause = 'WHERE ' + conditions.join(' AND ');

    const [customers, countRes] = await Promise.all([
      query(
        `SELECT id, name, email, role, wholesaleStatus, businessName, phone, isBlocked, createdAt FROM Users ${whereClause} ORDER BY createdAt DESC OFFSET @skip ROWS FETCH NEXT @limit ROWS ONLY`,
        params
      ),
      query(`SELECT COUNT(*) as count FROM Users ${whereClause}`, params),
    ]);

    // Get order counts for each customer
    const enriched = [];
    for (const c of customers) {
      const ordersRes = await query('SELECT COUNT(*) as count FROM Orders WHERE userId = @userId', { userId: c.id });
      enriched.push({
        ...c,
        orderCount: ordersRes[0]?.count || 0,
      });
    }

    return NextResponse.json({
      customers: enriched,
      pagination: { page, limit, total: countRes[0]?.count || 0, pages: Math.ceil((countRes[0]?.count || 0) / limit) },
    });
  } catch (error) {
    console.error('Customers error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}