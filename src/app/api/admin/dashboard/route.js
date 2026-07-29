import { NextResponse } from 'next/server';
import { dbConnect, query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const [totalOrdersRes, revenueRes, pendingRes, totalProductsRes, lowStockRes, totalCustomersRes, recentOrdersRes, pendingWholesaleRes] = await Promise.all([
      query('SELECT COUNT(*) as count FROM Orders'),
      query("SELECT ISNULL(SUM(total), 0) as total FROM Orders WHERE paymentStatus = 'paid'"),
      query("SELECT COUNT(*) as count FROM Orders WHERE status = 'pending'"),
      query('SELECT COUNT(*) as count FROM Products'),
      query("SELECT COUNT(*) as count FROM Products WHERE stock <= lowStockThreshold"),
      query("SELECT COUNT(*) as count FROM Users WHERE role IN ('customer', 'wholesale_customer')"),
      query('SELECT TOP 10 id, orderNumber, userId, total, status, paymentStatus, createdAt FROM Orders ORDER BY createdAt DESC'),
      query("SELECT COUNT(*) as count FROM Users WHERE role = 'wholesale_customer' AND wholesaleStatus = 'pending'"),
    ]);

    // Get user names for recent orders
    const enrichedOrders = [];
    for (const order of recentOrdersRes) {
      let userName = 'Guest', userEmail = '';
      if (order.userId) {
        const u = await query('SELECT name, email FROM Users WHERE id = @id', { id: order.userId });
        if (u[0]) { userName = u[0].name; userEmail = u[0].email; }
      }
      enrichedOrders.push({
        ...order,
        user: { name: userName, email: userEmail },
      });
    }

    return NextResponse.json({
      stats: {
        totalOrders: totalOrdersRes[0]?.count || 0,
        totalRevenue: revenueRes[0]?.total || 0,
        pendingOrders: pendingRes[0]?.count || 0,
        totalProducts: totalProductsRes[0]?.count || 0,
        lowStockProducts: lowStockRes[0]?.count || 0,
        totalCustomers: totalCustomersRes[0]?.count || 0,
        pendingWholesale: pendingWholesaleRes[0]?.count || 0,
      },
      recentOrders: enrichedOrders,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}