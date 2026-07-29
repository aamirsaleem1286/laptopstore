import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const block = body.block === true;

    await dbConnect();
    const admin = await query('SELECT id FROM Users WHERE id = @id', { id: params.id });
    if (!admin[0]) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    await execute(
      'UPDATE Users SET isBlocked = @block, updatedAt = GETDATE() WHERE id = @id',
      { block: block ? 1 : 0, id: params.id }
    );
    return NextResponse.json({ message: block ? 'Admin blocked' : 'Admin unblocked' });
  } catch (error) {
    console.error('Block admin error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}