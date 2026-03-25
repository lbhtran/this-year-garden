import { verifyToken } from '@clerk/backend';
import type { VercelRequest } from '@vercel/node';

export async function verifyAuth(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  try {
    const { sub } = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    return !!sub;
  } catch {
    return false;
  }
}
