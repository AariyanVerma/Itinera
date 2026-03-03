import { getSql } from '../lib/db.js';
import { hashPassword, createToken } from '../lib/auth.js';
import { cors, json } from '../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { email, password, full_name } = body;
    if (!email || !password || !full_name) {
      return json(res, 400, { error: 'Missing email, password, or full_name' });
    }
    const sql = getSql();
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) return json(res, 409, { error: 'Email already registered' });

    const password_hash = hashPassword(password);
    const [user] = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${password_hash}, ${full_name})
      RETURNING id, email, full_name, profile_photo_url, level, xp_points, created_at
    `;
    const token = await createToken(user.id, user.email);
    return json(res, 201, { user: { ...user, password_hash: undefined }, token });
  } catch (e) {
    console.error('signup', e);
    return json(res, 500, { error: 'Registration failed' });
  }
}
