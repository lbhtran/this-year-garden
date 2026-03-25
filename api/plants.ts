import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_verifyAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.POSTGRES_URL!);

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM plants ORDER BY id`;
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    if (!(await verifyAuth(req))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id, name, emoji, stage, next_step, placement, min_temp, frost_sensitive } = req.body as {
      id: string;
      name: string;
      emoji?: string;
      stage: string;
      next_step?: string;
      placement?: string;
      min_temp?: number;
      frost_sensitive?: boolean;
    };
    const rows = await sql`
      INSERT INTO plants (id, name, emoji, stage, next_step, placement, min_temp, frost_sensitive, updated_at)
      VALUES (${id}, ${name}, ${emoji ?? null}, ${stage}, ${next_step ?? null}, ${placement ?? null}, ${min_temp ?? null}, ${frost_sensitive ?? false}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        emoji = EXCLUDED.emoji,
        stage = EXCLUDED.stage,
        next_step = EXCLUDED.next_step,
        placement = EXCLUDED.placement,
        min_temp = EXCLUDED.min_temp,
        frost_sensitive = EXCLUDED.frost_sensitive,
        updated_at = NOW()
      RETURNING *
    `;
    return res.status(200).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
