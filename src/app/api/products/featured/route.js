import { NextResponse } from 'next/server';
import { dbConnect, query } from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    const rows = await query(
      `SELECT p.*, c.name as categoryName, c.slug as categorySlug
       FROM Products p LEFT JOIN Categories c ON p.categoryId = c.id
       WHERE p.isActive = 1 AND p.isFeatured = 1
       ORDER BY p.createdAt DESC
       OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY`
    );

    const products = rows.map(p => ({
      ...p,
      specifications: p.specifications ? JSON.parse(p.specifications) : null,
      images: p.images ? JSON.parse(p.images) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      category: p.categoryId ? { name: p.categoryName, slug: p.categorySlug } : undefined,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Featured error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured' }, { status: 500 });
  }
}