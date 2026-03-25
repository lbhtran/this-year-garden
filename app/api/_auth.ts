import { createClerkClient } from '@clerk/nextjs/server';

/**
 * Lazy-initialized Clerk client — created once and reused across requests to
 * avoid per-request instantiation overhead in serverless environments.
 */
let _clerk: ReturnType<typeof createClerkClient> | null = null;

function getClerkClient() {
  if (!process.env.CLERK_SECRET_KEY) return null;
  if (!_clerk) {
    _clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
    });
  }
  return _clerk;
}

/**
 * Verifies the Clerk session token directly from the incoming request.
 *
 * The client sends `Authorization: Bearer <sessionToken>` with every mutating
 * request (see src/hooks/usePlants.ts and useShopping.ts). This helper calls
 * Clerk's backend SDK to verify that token without requiring clerkMiddleware()
 * to be running. Returns the userId on success, or null if unauthenticated.
 */
export async function getAuthenticatedUserId(request: Request): Promise<string | null> {
  const clerk = getClerkClient();
  if (!clerk) return null;
  try {
    const state = await clerk.authenticateRequest(request);
    if (!state.isSignedIn) return null;
    return state.toAuth().userId;
  } catch (err) {
    console.error('[Clerk auth] authenticateRequest failed:', err);
    return null;
  }
}
