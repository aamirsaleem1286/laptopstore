import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser, isAdminOrStaff } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    await dbConnect();
    const categories = await query('SELECT * FROM Categories WHERE isActive = 1 ORDER BY name ASC');
    return NextResponse.json({ categories });
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
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const category = {
      id: uuidv4(),
      name: data.name,
      slug: slugify(data.name),
      image: data.image || null,
      parentId: data.parentId || null,
    };

    await execute(
      'INSERT INTO Categories (id, name, slug, image, parentId, createdAt, updatedAt) VALUES (@id, @name, @slug, @image, @parentId, GETDATE(), GETDATE())',
      category
    );

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminOrStaff(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { _id, ...data } = await request.json();
    const id = _id || data.id;

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const updates = {};
    if (data.name) updates.name = data.name;
    if (data.name) updates.slug = slugify(data.name);
    if (data.image !== undefined) updates.image = data.image;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    delete updates.id;
    delete updates._id;

    const setClauses = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    await execute(`UPDATE Categories SET ${setClauses}, updatedAt = GETDATE() WHERE id = @id`, { ...updates, id });

    const rows = await query('SELECT * FROM Categories WHERE id = @id', { id });
    return NextResponse.json({ category: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    await execute('DELETE FROM Categories WHERE id = @id', { id });
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}