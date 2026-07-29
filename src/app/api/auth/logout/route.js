import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { clearAuthCookies } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  await clearAuthCookies(response);
  return response;
}
