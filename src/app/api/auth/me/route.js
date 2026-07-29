import { NextResponse } from 'next/server';
import { dbConnect, query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const rows = await query(
      'SELECT id, name, email, role, wholesaleStatus, businessName, phone, addresses, isBlocked, createdAt, updatedAt FROM Users WHERE id = @id',
      { id: authUser.userId }
    );
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse JSON fields
    if (user.addresses && typeof user.addresses === 'string') user.addresses = JSON.parse(user.addresses);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = ['name', 'phone'];
    const sanitized = {};
    for (const field of allowedFields) {
      if (updates[field]) sanitized[field] = updates[field];
    }

    const now = new Date().toISOString();
    sanitized.updatedAt = now;

    const setClauses = Object.keys(sanitized).map(k => `${k} = @${k}`).join(', ');
    await query(
      `UPDATE Users SET ${setClauses} WHERE id = @id`,
      { ...sanitized, id: authUser.userId }
    );

    const rows = await query(
      'SELECT id, name, email, role, wholesaleStatus, businessName, phone, isBlocked, createdAt, updatedAt FROM Users WHERE id = @id',
      { id: authUser.userId }
    );
    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}