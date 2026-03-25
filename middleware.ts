import { NextResponse } from 'next/server';

// Clerk middleware removed: clerkMiddleware() requires Node.js-only APIs that
// are incompatible with Vercel's Edge Function runtime, causing
// MIDDLEWARE_INVOCATION_FAILED on every request. Auth is verified directly in
// each API route handler via createClerkClient().authenticateRequest().
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
