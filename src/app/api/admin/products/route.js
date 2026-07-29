import { NextResponse } from 'next/server';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser, isAdminOrStaff } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdminOrStaff(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');

    let whereClause = '';
    const params = {};
    if (search) {
      whereClause = 'WHERE (p.name LIKE @search OR p.brand LIKE @search)';
      params.search = `%${search}%`;
    }

    const [products, countRes] = await Promise.all([
      query(
        `SELECT p.*, c.name as categoryName FROM Products p LEFT JOIN Categories c ON p.categoryId = c.id ${whereClause} ORDER BY p.createdAt DESC OFFSET @skip ROWS FETCH NEXT @limit ROWS ONLY`,
        { ...params, skip, limit }
      ),
      query(`SELECT COUNT(*) as count FROM Products p ${whereClause}`, params),
    ]);

    const parsed = products.map(p => ({
      ...p,
      specifications: p.specifications ? JSON.parse(p.specifications) : null,
      images: p.images ? JSON.parse(p.images) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
    }));

    return NextResponse.json({
      products: parsed,
      pagination: { page, limit, total: countRes[0]?.count || 0, pages: Math.ceil((countRes[0]?.count || 0) / limit) },
    });
  } catch (error) {
    console.error('Admin products error:', error);
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

    if (!data.name || !data.brand || !data.category || !data.retailPrice) {
      return NextResponse.json({ error: 'Name, brand, category, and retail price are required' }, { status: 400 });
    }

    let slug = data.slug || slugify(data.name);
    const existing = await query('SELECT id FROM Products WHERE slug = @slug', { slug });
    if (existing[0]) {
      slug = `${slug}-${Date.now()}`;
    }

    const productData = {
      id: uuidv4(),
      name: data.name,
      slug,
      brand: data.brand,
      categoryId: data.category || data.categoryId,
      description: data.description || '',
      specifications: data.specifications ? JSON.stringify(data.specifications) : null,
      retailPrice: data.retailPrice,
      wholesalePrice: data.wholesalePrice || null,
      wholesaleMinQty: data.wholesaleMinQty || 5,
      costPrice: data.costPrice || 0,
      stock: data.stock || 0,
      lowStockThreshold: data.lowStockThreshold || 5,
      images: data.images ? JSON.stringify(data.images) : '[]',
      condition: data.condition || 'new',
      isFeatured: data.isFeatured || false,
      isNewArrival: data.isNewArrival || false,
      isBestSeller: data.isBestSeller || false,
      isActive: data.isActive !== false,
      tags: data.tags ? JSON.stringify(data.tags) : '[]',
    };

    await execute(
      `INSERT INTO Products (id, name, slug, brand, categoryId, description, specifications, retailPrice, wholesalePrice, wholesaleMinQty, costPrice, stock, lowStockThreshold, images, condition, isFeatured, isNewArrival, isBestSeller, isActive, tags, createdAt, updatedAt)
       VALUES (@id, @name, @slug, @brand, @categoryId, @description, @specifications, @retailPrice, @wholesalePrice, @wholesaleMinQty, @costPrice, @stock, @lowStockThreshold, @images, @condition, @isFeatured, @isNewArrival, @isBestSeller, @isActive, @tags, GETDATE(), GETDATE())`,
      productData
    );

    return NextResponse.json({ product: productData }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}