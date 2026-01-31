import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/broker', '/fixer', '/admin'];
const publicRoutes = ['/login', '/register', '/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from cookies
  const session = request.cookies.get('fixd_session');

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If it's a protected route and no session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If it's a public route and user is already logged in
  if (isPublicRoute && session && (pathname === '/login' || pathname === '/register')) {
    // Redirect to appropriate dashboard
    // Note: We'd need to decode the session to check role, for now redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
