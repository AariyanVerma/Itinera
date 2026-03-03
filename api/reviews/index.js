import { getSql } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { cors, json } from '../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const stayId = req.query?.stayId;
    if (!stayId) return json(res, 400, { error: 'stayId required' });
    try {
      const sql = getSql();
      const reviews = await sql`
        SELECT r.id, r.stay_id, r.user_id, r.rating, r.comment, r.created_at,
               u.full_name, u.profile_photo_url
        FROM reviews r
        JOIN users u ON u.id = r.user_id
        WHERE r.stay_id = ${stayId}
        ORDER BY r.created_at DESC
        LIMIT 100
      `;
      return json(res, 200, { reviews });
    } catch (e) {
      console.error('reviews get', e);
      return json(res, 500, { error: 'Failed to load reviews' });
    }
  }

  if (req.method === 'POST') {
    const auth = await requireAuth(req);
    if (!auth.ok) return json(res, auth.status, auth.body);
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { stay_id, rating, comment } = body;
      if (!stay_id || rating == null || rating < 1 || rating > 5) {
        return json(res, 400, { error: 'stay_id and rating (1-5) required' });
      }
      const sql = getSql();
      const [inserted] = await sql`
        INSERT INTO reviews (stay_id, user_id, rating, comment)
        VALUES (${stay_id}, ${auth.userId}, ${Number(rating)}, ${comment || ''})
        ON CONFLICT (stay_id, user_id) DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment
        RETURNING id, stay_id, user_id, rating, comment, created_at
      `;
      return json(res, 201, { review: inserted });
    } catch (e) {
      console.error('review post', e);
      return json(res, 500, { error: 'Failed to save review' });
    }
  }

  return json(res, 405, { error: 'Method not allowed' });
}
