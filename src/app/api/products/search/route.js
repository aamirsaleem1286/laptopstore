import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query } from '@/lib/db';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const rows = await query(
      `SELECT id, name, slug, brand, retailPrice, images
       FROM Products
       WHERE isActive = 1 AND (name LIKE @search OR brand LIKE @search)
       ORDER BY CASE WHEN name LIKE @exact THEN 0 ELSE 1 END, name
       OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY`,
      { search: `%${q}%`, exact: `${q}%` }
    );

    const results = rows.map(r => ({
      ...r,
      images: r.images ? JSON.parse(r.images) : [],
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}