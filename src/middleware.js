import { NextResponse } from 'next/server';
import { getAuthUser, isAdminOrStaff } from '@/lib/auth';

const adminPaths = ['/admin', '/api/admin'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Debug: check cookies
  const accessTokenCookie = request.cookies.get('accessToken')?.value;
  const refreshTokenCookie = request.cookies.get('refreshToken')?.value;
  console.log('[Middleware] pathname:', pathname, 'hasAccessToken:', !!accessTokenCookie, 'hasRefreshToken:', !!refreshTokenCookie);

  // Allow static files and API routes we don't protect
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/api/products' ||
    pathname.startsWith('/api/products/') ||
    pathname === '/api/search' ||
    pathname === '/api/contact' ||
    pathname === '/api/newsletter' ||
    pathname === '/api/upload'
  ) {
    return NextResponse.next();
  }

  const user = await getAuthUser(request);
  console.log('[Middleware] pathname:', pathname, 'user:', user ? user.email : null);

  // Check if path requires auth (exclude login/register pages themselves)
  const isAccountPath = pathname.startsWith('/account');
  const isAuthPage = pathname === '/account/login' || pathname === '/account/register';
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p));
  const isAdminLoginPage = pathname === '/admin/login';
  const isUnifiedLoginPage = pathname === '/login' || pathname === '/register';

  if (isAccountPath && !user && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && !isAdminLoginPage) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isAdminOrStaff(user.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};