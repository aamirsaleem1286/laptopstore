import { NextResponse } from 'next/server';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser, isAdminOrStaff } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminOrStaff(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const rows = await query(
      'SELECT p.*, c.name as categoryName, c.slug as categorySlug FROM Products p LEFT JOIN Categories c ON p.categoryId = c.id WHERE p.id = @id',
      { id: params.id }
    );
    if (!rows[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = {
      ...rows[0],
      specifications: rows[0].specifications ? JSON.parse(rows[0].specifications) : null,
      images: rows[0].images ? JSON.parse(rows[0].images) : [],
      tags: rows[0].tags ? JSON.parse(rows[0].tags) : [],
      category: rows[0].categoryId ? { name: rows[0].categoryName, slug: rows[0].categorySlug } : undefined,
    };

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminOrStaff(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const data = await request.json();

    const existing = await query('SELECT * FROM Products WHERE id = @id', { id: params.id });
    if (!existing[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let slug = existing[0].slug;
    if (data.name && data.name !== existing[0].name) {
      slug = data.slug || slugify(data.name);
      const dup = await query('SELECT id FROM Products WHERE slug = @slug AND id != @id', { slug, id: params.id });
      if (dup[0]) slug = `${slug}-${Date.now()}`;
    }

    const updates = {
      ...data,
      slug,
      categoryId: data.category || data.categoryId || existing[0].categoryId,
      specifications: data.specifications ? (typeof data.specifications === 'string' ? data.specifications : JSON.stringify(data.specifications)) : existing[0].specifications,
      images: data.images ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : existing[0].images,
      tags: data.tags ? (typeof data.tags === 'string' ? data.tags : JSON.stringify(data.tags)) : existing[0].tags,
      updatedAt: new Date().toISOString(),
    };

    // Remove id, _id, createdAt from updates
    delete updates.id;
    delete updates._id;
    delete updates.createdAt;
    delete updates.categoryName;
    delete updates.categorySlug;

    const setClauses = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    await execute(`UPDATE Products SET ${setClauses} WHERE id = @pid`, { ...updates, pid: params.id });

    const updated = await query('SELECT * FROM Products WHERE id = @id', { id: params.id });
    const product = {
      ...updated[0],
      specifications: updated[0].specifications ? JSON.parse(updated[0].specifications) : null,
      images: updated[0].images ? JSON.parse(updated[0].images) : [],
      tags: updated[0].tags ? JSON.parse(updated[0].tags) : [],
    };

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminOrStaff(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    await execute('DELETE FROM Products WHERE id = @id', { id: params.id });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}