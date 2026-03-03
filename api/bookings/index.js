import { getSql } from '../lib/db.js';
import { requireAuth } from '../lib/auth.js';
import { cors, json } from '../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const auth = await requireAuth(req);
    if (!auth.ok) return json(res, auth.status, auth.body);
    try {
      const sql = getSql();
      const bookings = await sql`
        SELECT b.id, b.stay_id, b.check_in, b.check_out, b.guests, b.total_amount, b.currency, b.status,
               b.guest_name, b.guest_email, b.special_requests, b.room_selections, b.add_ons, b.created_at,
               s.title AS stay_title, s.location AS stay_location,
               (SELECT url FROM stay_images WHERE stay_id = s.id ORDER BY sort_order LIMIT 1) AS stay_image
        FROM bookings b
        JOIN stays s ON s.id = b.stay_id
        WHERE b.user_id = ${auth.userId}
        ORDER BY b.check_in DESC
        LIMIT 100
      `;
      return json(res, 200, { bookings });
    } catch (e) {
      console.error('bookings get', e);
      return json(res, 500, { error: 'Failed to load bookings' });
    }
  }

  if (req.method === 'POST') {
    const auth = await requireAuth(req);
    if (!auth.ok) return json(res, auth.status, auth.body);
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const {
        stay_id,
        check_in,
        check_out,
        guests,
        total_amount,
        guest_name,
        guest_email,
        guest_phone,
        special_requests,
        room_selections,
        add_ons,
      } = body;
      if (!stay_id || !check_in || !check_out || !guests || total_amount == null) {
        return json(res, 400, { error: 'Missing required booking fields' });
      }
      const sql = getSql();
      const [booking] = await sql`
        INSERT INTO bookings (user_id, stay_id, check_in, check_out, guests, total_amount, guest_name, guest_email, guest_phone, special_requests, room_selections, add_ons, status)
        VALUES (${auth.userId}, ${stay_id}, ${check_in}, ${check_out}, ${Number(guests)}, ${Number(total_amount)},
                ${guest_name || null}, ${guest_email || null}, ${guest_phone || null}, ${special_requests || null},
                ${room_selections ? JSON.stringify(room_selections) : null}, ${add_ons ? JSON.stringify(add_ons) : null}, 'confirmed')
        RETURNING id, stay_id, check_in, check_out, guests, total_amount, currency, status, created_at
      `;
      return json(res, 201, { booking });
    } catch (e) {
      console.error('booking post', e);
      return json(res, 500, { error: 'Failed to create booking' });
    }
  }

  return json(res, 405, { error: 'Method not allowed' });
}
