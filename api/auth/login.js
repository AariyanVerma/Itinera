import { getSql } from '../lib/db.js';
import { verifyPassword, createToken } from '../lib/auth.js';
import { cors, json } from '../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { email, password } = body;
    if (!email || !password) return json(res, 400, { error: 'Missing email or password' });

    const sql = getSql();
    const [user] = await sql`
      SELECT id, email, password_hash, full_name, profile_photo_url, phone, country, level, xp_points, created_at
      FROM users WHERE email = ${email}
    `;
    if (!user || !verifyPassword(password, user.password_hash)) {
      return json(res, 401, { error: 'Invalid email or password' });
    }
    const token = await createToken(user.id, user.email);
    const { password_hash, ...safe } = user;
    return json(res, 200, { user: safe, token });
  } catch (e) {
    console.error('login', e);
    return json(res, 500, { error: 'Login failed' });
  }
}
