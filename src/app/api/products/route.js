import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query as dbQuery } from '@/lib/db';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const conditions = ['p.isActive = 1'];
    const params = {};

    if (searchParams.get('brand')) {
      conditions.push('p.brand = @brand');
      params.brand = searchParams.get('brand');
    }
    if (searchParams.get('category')) {
      conditions.push('p.categoryId = @category');
      params.category = searchParams.get('category');
    }
    if (searchParams.get('condition')) {
      conditions.push('p.condition = @condition');
      params.condition = searchParams.get('condition');
    }
    if (searchParams.get('minPrice')) {
      conditions.push('p.retailPrice >= @minPrice');
      params.minPrice = Number(searchParams.get('minPrice'));
    }
    if (searchParams.get('maxPrice')) {
      conditions.push('p.retailPrice <= @maxPrice');
      params.maxPrice = Number(searchParams.get('maxPrice'));
    }
    if (searchParams.get('q')) {
      conditions.push('(p.name LIKE @search OR p.brand LIKE @search)');
      params.search = `%${searchParams.get('q')}%`;
    }

    // Specs filters (stored as JSON)
    const specFields = ['ram', 'processor', 'storage', 'storageType'];
    specFields.forEach(s => {
      if (searchParams.get(s)) {
        conditions.push(`JSON_VALUE(p.specifications, '$.${s}') = @spec_${s}`);
        params[`spec_${s}`] = searchParams.get(s);
      }
    });

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '12'));
    const skip = (page - 1) * limit;

    const sortField = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';
    let orderBy = `p.${sortField} ${sortOrder}`;
    if (sortField === 'popularity') orderBy = 'p.numReviews DESC';

    const [products, countResult] = await Promise.all([
      dbQuery(
        `SELECT p.*, c.name as categoryName, c.slug as categorySlug
         FROM Products p LEFT JOIN Categories c ON p.categoryId = c.id
         ${whereClause} ORDER BY ${orderBy} OFFSET @skip ROWS FETCH NEXT @limit ROWS ONLY`,
        { ...params, skip, limit }
      ),
      dbQuery(`SELECT COUNT(*) as count FROM Products p ${whereClause}`, params),
    ]);

    // Parse JSON fields
    const parsed = products.map(p => ({
      ...p,
      specifications: p.specifications ? JSON.parse(p.specifications) : null,
      images: p.images ? JSON.parse(p.images) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      category: p.categoryId ? { name: p.categoryName, slug: p.categorySlug } : undefined,
    }));

    return NextResponse.json({
      products: parsed,
      pagination: {
        page,
        limit,
        total: countResult[0]?.count || 0,
        pages: Math.ceil((countResult[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}