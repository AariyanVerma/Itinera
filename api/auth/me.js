import { getSql } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { cors, json } from '../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  const auth = await requireAuth(req);
  if (!auth.ok) return json(res, auth.status, auth.body);

  try {
    const sql = getSql();
    const [user] = await sql`
      SELECT id, email, full_name, profile_photo_url, phone, country, level, xp_points, created_at
      FROM users WHERE id = ${auth.userId}
    `;
    if (!user) return json(res, 404, { error: 'User not found' });

    const [trips] = await sql`SELECT COUNT(*)::int AS c FROM bookings WHERE user_id = ${auth.userId} AND status = 'confirmed'`;
    const [reviewsCount] = await sql`SELECT COUNT(*)::int AS c FROM reviews WHERE user_id = ${auth.userId}`;
    return json(res, 200, {
      ...user,
      trips_count: trips?.c ?? 0,
      reviews_count: reviewsCount?.c ?? 0,
    });
  } catch (e) {
    console.error('me', e);
    return json(res, 500, { error: 'Failed to load user' });
  }
}
