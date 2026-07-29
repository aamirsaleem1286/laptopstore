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
    const range = searchParams.get('range') || '30d';
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;

    // 1. Sales over time (group by day)
    const sales = await query(
      `SELECT CONVERT(date, createdAt) as date, SUM(total) as revenue, COUNT(*) as orders
       FROM Orders WHERE createdAt >= DATEADD(day, -@days, GETDATE()) AND paymentStatus = 'paid'
       GROUP BY CONVERT(date, createdAt) ORDER BY date ASC`,
      { days }
    );

    // 2. Summary stats
    const summaryRes = await query(
      "SELECT ISNULL(SUM(total), 0) as totalRevenue, COUNT(*) as totalOrders FROM Orders WHERE paymentStatus = 'paid'"
    );

    // 3. Top selling products (unwind items JSON)
    const orders = await query(
      `SELECT items FROM Orders WHERE createdAt >= DATEADD(day, -@days, GETDATE()) AND paymentStatus = 'paid'`,
      { days }
    );

    // Parse items and aggregate in JS since JSON parsing in SQL Server is complex
    const productMap = {};
    for (const order of orders) {
      const items = order.items ? JSON.parse(order.items) : [];
      for (const item of items) {
        if (!productMap[item.productId]) {
          productMap[item.productId] = { productId: item.productId, name: item.name, units: 0, revenue: 0 };
        }
        productMap[item.productId].units += item.quantity;
        productMap[item.productId].revenue += item.price * item.quantity;
      }
    }
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);

    // 4. Top categories
    const catMap = {};
    for (const order of orders) {
      const items = order.items ? JSON.parse(order.items) : [];
      for (const item of items) {
        const prodRows = await query('SELECT categoryId FROM Products WHERE id = @id', { id: item.productId });
        if (prodRows[0] && prodRows[0].categoryId) {
          const catRows = await query('SELECT name FROM Categories WHERE id = @id', { id: prodRows[0].categoryId });
          const catName = catRows[0]?.name || 'Unknown';
          if (!catMap[catName]) catMap[catName] = 0;
          catMap[catName] += item.price * item.quantity;
        }
      }
    }
    const topCategories = Object.entries(catMap)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // 5. Customer growth over time
    const customerGrowth = await query(
      `SELECT CONVERT(date, createdAt) as date, COUNT(*) as newCustomers
       FROM Users WHERE createdAt >= DATEADD(day, -@days, GETDATE()) AND role IN ('customer', 'wholesale_customer')
       GROUP BY CONVERT(date, createdAt) ORDER BY date ASC`,
      { days }
    );

    // 6. Order status distribution
    const orderStatus = await query(
      `SELECT status, COUNT(*) as count FROM Orders WHERE createdAt >= DATEADD(day, -@days, GETDATE()) GROUP BY status`,
      { days }
    );

    // 7. Total products sold
    let totalProductsSold = 0;
    for (const order of orders) {
      const items = order.items ? JSON.parse(order.items) : [];
      for (const item of items) {
        totalProductsSold += item.quantity;
      }
    }

    // 8. New customers count
    const newCustomersRes = await query(
      `SELECT COUNT(*) as count FROM Users WHERE createdAt >= DATEADD(day, -@days, GETDATE()) AND role IN ('customer', 'wholesale_customer')`,
      { days }
    );

    return NextResponse.json({
      totalRevenue: summaryRes[0]?.totalRevenue || 0,
      totalOrders: summaryRes[0]?.totalOrders || 0,
      totalProductsSold,
      newCustomers: newCustomersRes[0]?.count || 0,
      sales: sales.map(s => ({ date: s.date, revenue: s.revenue, orders: s.orders })),
      topProducts,
      topCategories,
      customerGrowth: customerGrowth.map(c => ({ date: c.date, newCustomers: c.newCustomers })),
      orderStatus: orderStatus.map(s => ({ status: s.status, count: s.count })),
    });
  } catch (error) {
    console.error('Sales report error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}