import { NextResponse } from 'next/server';
import { dbConnect, query, execute } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    await dbConnect();
    const rows = await query('SELECT * FROM Settings');
    const map = {};
    rows.forEach(r => { map[r.key] = r.value; });
    return NextResponse.json({ settings: map });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const data = await request.json();

    for (const [key, value] of Object.entries(data)) {
      const existing = await query('SELECT id FROM Settings WHERE [key] = @key', { key });
      if (existing[0]) {
        await execute(
          'UPDATE Settings SET value = @value, updatedAt = GETDATE() WHERE [key] = @key',
          { key, value: JSON.stringify(value) }
        );
      } else {
        await execute(
          'INSERT INTO Settings (id, [key], value, updatedAt) VALUES (@id, @key, @value, GETDATE())',
          { id: uuidv4(), key, value: JSON.stringify(value) }
        );
      }
    }

    return NextResponse.json({ message: 'Settings updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}