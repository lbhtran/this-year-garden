import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Required for Vercel to deploy middleware as a Node.js function instead of
    // an Edge Function. Clerk v6 uses Node.js-only APIs that are not available
    // in the Edge runtime. The property is valid at runtime in Next.js 15.2+
    // but has not yet been added to the TypeScript type definitions.
    // @ts-expect-error: nodeMiddleware is valid but not yet reflected in types
    nodeMiddleware: true,
  },
};

export default nextConfig;
