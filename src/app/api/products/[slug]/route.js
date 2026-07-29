import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const rows = await query(
      `SELECT p.*, c.name as categoryName, c.slug as categorySlug
       FROM Products p LEFT JOIN Categories c ON p.categoryId = c.id
       WHERE p.slug = @slug AND p.isActive = 1`,
      { slug: params.slug }
    );

    if (!rows[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = {
      ...rows[0],
      specifications: rows[0].specifications ? JSON.parse(rows[0].specifications) : null,
      images: rows[0].images ? JSON.parse(rows[0].images) : [],
      tags: rows[0].tags ? JSON.parse(rows[0].tags) : [],
      category: rows[0].categoryId ? { _id: rows[0].categoryId, name: rows[0].categoryName, slug: rows[0].categorySlug } : undefined,
    };

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Product detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}