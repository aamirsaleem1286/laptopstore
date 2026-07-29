import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import sql from '@/lib/sql';
import { setAuthCookies } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, role, businessName, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await sql.findOne('Users', { email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'customer',
      phone: phone || null,
    };

    if (role === 'wholesale_customer') {
      userData.wholesaleStatus = 'pending';
      userData.businessName = businessName || null;
    }

    const user = await sql.create('Users', userData);

    const response = NextResponse.json({
      message: 'Registration successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, wholesaleStatus: user.wholesaleStatus },
    }, { status: 201 });

    await setAuthCookies(response, user);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}