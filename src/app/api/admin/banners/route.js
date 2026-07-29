import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser, isAdminOrStaff } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import sql from '@/lib/sql';

export async function GET() {
  try {
    await dbConnect();
    const banners = await sql.findAll('Banners', { orderBy: { position: 'ASC' } });
    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminOrStaff(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const data = await request.json();
    const banner = {
      id: uuidv4(),
      title: data.title,
      subtitle: data.subtitle || null,
      image: data.image,
      link: data.link || null,
      position: data.position || 0,
      isActive: data.isActive !== false ? 1 : 0,
    };

    await sql.create('Banners', banner);

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminOrStaff(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { _id, ...updates } = await request.json();
    const id = _id || updates.id;
    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
    }

    delete updates.id;
    delete updates._id;
    delete updates.createdAt;

    const boolFields = ['isActive'];
    for (const field of boolFields) {
      if (updates[field] !== undefined) updates[field] = updates[field] ? 1 : 0;
    }

    updates.updatedAt = new Date().toISOString();
    await sql.update('Banners', id, updates);

    const banner = await sql.findById('Banners', id);
    return NextResponse.json({ banner });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
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
    await sql.delete('Banners', searchParams.get('id'));
    return NextResponse.json({ message: 'Banner deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}