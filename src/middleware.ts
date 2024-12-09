import { verifyToken } from '@/lib/auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Add the paths that need authentication
const protectedPaths = [
  '/stories/edit',
];

export function middleware(request: NextRequest) {
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Get the token from the cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirect to login if no token exists
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Continue to the protected route
    return NextResponse.next();
  }

  // Continue to non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/stories/edit/:path*',
  ],
}; 