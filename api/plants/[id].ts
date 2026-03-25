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
    const fields = req.body as Partial<{
      name: string;
      emoji: string;
      stage: string;
      next_step: string;
      placement: string;
      min_temp: number;
      frost_sensitive: boolean;
    }>;
    const rows = await sql`
      UPDATE plants SET
        name = COALESCE(${fields.name !== undefined ? fields.name : null}, name),
        emoji = COALESCE(${fields.emoji !== undefined ? fields.emoji : null}, emoji),
        stage = COALESCE(${fields.stage !== undefined ? fields.stage : null}, stage),
        next_step = COALESCE(${fields.next_step !== undefined ? fields.next_step : null}, next_step),
        placement = COALESCE(${fields.placement !== undefined ? fields.placement : null}, placement),
        min_temp = COALESCE(${fields.min_temp !== undefined ? fields.min_temp : null}, min_temp),
        frost_sensitive = COALESCE(${fields.frost_sensitive !== undefined ? fields.frost_sensitive : null}, frost_sensitive),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (req.method === 'DELETE') {
    if (!(await verifyAuth(req))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await sql`DELETE FROM plants WHERE id = ${id}`;
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
