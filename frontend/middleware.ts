import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Note: Token is stored in localStorage (client-side), not cookies
  // So we can't check it in middleware. The client-side auth will handle redirects.
  // This middleware is mainly for other purposes if needed.
  
  // Protected routes - let client-side handle auth checks
  const protectedRoutes = ['/dashboard', '/chat', '/documents', '/presentations', '/websites', '/mobile-apps', '/admin', '/settings', '/pricing'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Public routes
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Allow all routes - client-side will handle authentication
  // This prevents middleware from blocking legitimate requests
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

