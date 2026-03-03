import { getSql } from './lib/db.js';
import { requireAuth } from './lib/auth.js';
import { cors, json } from './lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const auth = await requireAuth(req);
  if (!auth.ok) return json(res, auth.status, auth.body);

  try {
    const sql = getSql();

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT ss.stay_id, s.title, s.location, s.price_per_night, s.currency,
               (SELECT url FROM stay_images WHERE stay_id = s.id ORDER BY sort_order LIMIT 1) AS image_url
        FROM saved_stays ss
        JOIN stays s ON s.id = ss.stay_id
        WHERE ss.user_id = ${auth.userId}
      `;
      return json(res, 200, { saved_stays: rows.map((r) => r.stay_id), stays: rows });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { stay_id } = body;
      if (!stay_id) return json(res, 400, { error: 'stay_id required' });
      await sql`
        INSERT INTO saved_stays (user_id, stay_id) VALUES (${auth.userId}, ${stay_id})
        ON CONFLICT (user_id, stay_id) DO NOTHING
      `;
      return json(res, 201, { saved: true });
    }

    if (req.method === 'DELETE') {
      const stayId = req.query?.stay_id;
      if (!stayId) return json(res, 400, { error: 'stay_id required' });
      await sql`
        DELETE FROM saved_stays WHERE user_id = ${auth.userId} AND stay_id = ${stayId}
      `;
      return json(res, 200, { removed: true });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    console.error('saved-stays', e);
    return json(res, 500, { error: 'Request failed' });
  }
}
