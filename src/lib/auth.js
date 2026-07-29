import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Convert string secrets to Uint8Array for jose
function getSecretKey(secret) {
  return new TextEncoder().encode(secret);
}

export async function generateAccessToken(payload) {
  const secret = getSecretKey(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret);
}

export async function generateRefreshToken(payload) {
  const secret = getSecretKey(JWT_REFRESH_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(secret);
}

export async function verifyAccessToken(token) {
  try {
    const secret = getSecretKey(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function verifyRefreshToken(token) {
  try {
    const secret = getSecretKey(JWT_REFRESH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function setAuthCookies(response, user) {
  const accessToken = await generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    wholesaleStatus: user.wholesaleStatus,
  });

  const refreshToken = await generateRefreshToken({
    userId: user.id.toString(),
  });

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return { accessToken, refreshToken };
}

export async function clearAuthCookies(response) {
  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
}

export async function getAuthUser(request) {
  let cookieStore;
  if (request) {
    cookieStore = request.cookies;
  } else {
    cookieStore = await cookies();
  }
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  const decoded = await verifyAccessToken(accessToken);
  if (!decoded) {
    // Try refresh token
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (refreshToken) {
      const refreshDecoded = await verifyRefreshToken(refreshToken);
      if (refreshDecoded) {
        // In a real app, you'd regenerate tokens here
        return refreshDecoded;
      }
    }
    return null;
  }

  return decoded;
}

export function requireAuth(allowedRoles = []) {
  return async (request) => {
    const user = await getAuthUser(request);
    if (!user) {
      return { error: 'Unauthorized', status: 401 };
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return { error: 'Forbidden', status: 403 };
    }
    return { user };
  };
}

export function isAdminOrStaff(role) {
  return ['admin', 'manager', 'staff'].includes(role);
}

export function isWholesaleApproved(role, wholesaleStatus) {
  return role === 'wholesale_customer' && wholesaleStatus === 'approved';
}