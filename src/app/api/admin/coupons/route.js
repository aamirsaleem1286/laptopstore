import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import sql from '@/lib/sql';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const coupons = await query('SELECT * FROM Coupons ORDER BY createdAt DESC');
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const data = await request.json();

    const couponData = {
      id: uuidv4(),
      code: data.code ? data.code.toUpperCase() : '',
      type: data.discountType || data.type,
      description: data.description || '',
      value: data.value,
      minOrderAmount: data.minOrderAmount || 0,
      maxUses: data.maxUses || 100,
      usedCount: 0,
      isActive: data.isActive !== false ? 1 : 0,
      startDate: data.startDate || null,
      expiresAt: data.endDate || data.expiresAt || null,
      appliesTo: data.appliesTo || 'all',
    };

    await sql.create('Coupons', couponData);

    return NextResponse.json({ coupon: couponData }, { status: 201 });
  } catch (error) {
    console.error('Create coupon error:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { _id, discountType, endDate, createdAt, ...rest } = await request.json();
    const id = _id || rest.id;
    if (!id) {
      return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
    }

    const updates = { ...rest };
    if (discountType) updates.type = discountType;
    if (endDate) updates.expiresAt = endDate;
    delete updates.id;
    delete updates._id;
    delete updates.createdAt;

    if (updates.code) updates.code = updates.code.toUpperCase();
    if (updates.isActive !== undefined) updates.isActive = updates.isActive ? 1 : 0;

    updates.updatedAt = new Date().toISOString();

    await sql.update('Coupons', id, updates);

    const coupon = await sql.findById('Coupons', id);
    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    await sql.delete('Coupons', searchParams.get('id'));
    return NextResponse.json({ message: 'Coupon deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}