import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from './_verifyAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.POSTGRES_URL!);

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM shopping_items ORDER BY id`;
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    if (!(await verifyAuth(req))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id, name, category, bought } = req.body as {
      id: string;
      name: string;
      category?: string;
      bought?: boolean;
    };
    const rows = await sql`
      INSERT INTO shopping_items (id, name, category, bought, updated_at)
      VALUES (${id}, ${name}, ${category ?? null}, ${bought ?? false}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        bought = EXCLUDED.bought,
        updated_at = NOW()
      RETURNING *
    `;
    return res.status(200).json(rows[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
