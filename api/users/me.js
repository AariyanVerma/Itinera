import { getSql } from '../../lib/db.js';
import { requireAuth } from '../../lib/auth.js';
import { cors, json } from '../../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const auth = await requireAuth(req);
  if (!auth.ok) return json(res, auth.status, auth.body);

  try {
    const sql = getSql();

    if (req.method === 'GET') {
      const [user] = await sql`
        SELECT id, email, full_name, profile_photo_url, phone, country, level, xp_points, created_at
        FROM users WHERE id = ${auth.userId}
      `;
      if (!user) return json(res, 404, { error: 'User not found' });
      const [trips] = await sql`SELECT COUNT(*)::int AS c FROM bookings WHERE user_id = ${auth.userId} AND status = 'confirmed'`;
      const [reviewsCount] = await sql`SELECT COUNT(*)::int AS c FROM reviews WHERE user_id = ${auth.userId}`;
      return json(res, 200, { ...user, trips_count: trips?.c ?? 0, reviews_count: reviewsCount?.c ?? 0 });
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { full_name, phone, country, profile_photo_url } = body;
      if (full_name === undefined && phone === undefined && country === undefined && profile_photo_url === undefined) {
        return json(res, 400, { error: 'No fields to update' });
      }
      const [updated] = await sql`
        UPDATE users SET
          full_name = COALESCE(${full_name !== undefined ? full_name : null}, full_name),
          phone = COALESCE(${phone !== undefined ? phone : null}, phone),
          country = COALESCE(${country !== undefined ? country : null}, country),
          profile_photo_url = COALESCE(${profile_photo_url !== undefined ? profile_photo_url : null}, profile_photo_url),
          updated_at = NOW()
        WHERE id = ${auth.userId}
        RETURNING id, email, full_name, profile_photo_url, phone, country, level, xp_points
      `;
      return json(res, 200, updated);
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    console.error('users/me', e);
    return json(res, 500, { error: 'Request failed' });
  }
}
