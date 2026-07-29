import { NextResponse } from 'next/server';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { isBlocked } = await request.json();

    await execute(
      'UPDATE Users SET isBlocked = @isBlocked, updatedAt = GETDATE() WHERE id = @id',
      { isBlocked: isBlocked ? 1 : 0, id: params.id }
    );

    const rows = await query('SELECT id, name, email, role, isBlocked FROM Users WHERE id = @id', { id: params.id });
    if (!rows[0]) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: isBlocked ? 'Customer blocked' : 'Customer unblocked', customer: rows[0] });
  } catch (error) {
    console.error('Block customer error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}