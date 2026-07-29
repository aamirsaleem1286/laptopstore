import { NextResponse } from 'next/server';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const admins = await query(
      "SELECT id, name, email, role, isBlocked, createdAt FROM Users WHERE role IN ('admin', 'manager', 'staff') ORDER BY createdAt DESC"
    );
    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const data = await request.json();

    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM Users WHERE email = @email', { email: data.email.toLowerCase() });
    if (existing[0]) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const admin = {
      id: uuidv4(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role || 'staff',
      phone: data.phone || '',
      isBlocked: 0,
    };

    await execute(
      'INSERT INTO Users (id, name, email, password, role, phone, isBlocked, createdAt, updatedAt) VALUES (@id, @name, @email, @password, @role, @phone, @isBlocked, GETDATE(), GETDATE())',
      admin
    );

    const { password, ...adminData } = admin;
    return NextResponse.json({ admin: adminData }, { status: 201 });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}