import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { status } = await request.json();

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await execute(
      'UPDATE Users SET wholesaleStatus = @status, updatedAt = GETDATE() WHERE id = @id',
      { status, id: params.id }
    );

    const rows = await query('SELECT id, name, email, role, wholesaleStatus, businessName, phone FROM Users WHERE id = @id', { id: params.id });
    if (!rows[0]) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: `Wholesale ${status}`, customer: rows[0] });
  } catch (error) {
    console.error('Approve wholesale error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}