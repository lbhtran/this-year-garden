import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../_verifyAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.POSTGRES_URL!);
  const { id } = req.query as { id: string };

  if (req.method === 'PATCH') {
    if (!(await verifyAuth(req))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { bought } = req.body as { bought: boolean };
    const rows = await sql`
      UPDATE shopping_items SET bought = ${bought}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
