import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes (accessible without authentication)
const publicRoutes = ['/auth', '/api/auth', '/'];

// Protected routes (must be logged in)
const protectedRoutes = ['/dashboard', '/profile', '/appointments', '/find-doctors'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read authentication token from cookies
  const token = request.cookies.get('token')?.value;

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  const isRootRoute = pathname === '/';
  const isAuthRoute = pathname === '/auth';

  // If logged in and trying to access /auth, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If logged in and trying to access "/", redirect to dashboard
  if (token && isRootRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing a protected route without a token, redirect to /auth
  if (isProtectedRoute && !token) {
    const authUrl = new URL('/auth', request.url);
    authUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(authUrl);
  }

  // Allow public routes & any other non-protected paths
  return NextResponse.next();
}

// Middleware match config
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
