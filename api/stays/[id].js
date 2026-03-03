import { getSql } from '../lib/db.js';
import { cors, json } from '../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  const id = req.query?.id;
  if (!id) return json(res, 400, { error: 'Stay ID required' });

  try {
    const sql = getSql();
    const [stay] = await sql`
      SELECT id, title, location, city, country, description, guests_max, bedrooms, baths,
             price_per_night, currency, is_superhost, discount_percent, free_cancellation, wifi, parking, amenities
      FROM stays WHERE id = ${id}
    `;
    if (!stay) return json(res, 404, { error: 'Stay not found' });

    const [images] = await sql`SELECT url, sort_order FROM stay_images WHERE stay_id = ${id} ORDER BY sort_order`;
    const [rooms] = await sql`SELECT id, name, description, max_guests, bed_type, price_per_night, quantity_available FROM rooms WHERE stay_id = ${id} ORDER BY price_per_night`;
    const [ratingRow] = await sql`SELECT ROUND(AVG(rating)::numeric, 2) AS avg_rating, COUNT(*)::int AS count FROM reviews WHERE stay_id = ${id}`;

    return json(res, 200, {
      ...stay,
      images: (images || []).map((i) => i.url),
      rooms: rooms || [],
      avg_rating: ratingRow?.avg_rating ? Number(ratingRow.avg_rating) : null,
      reviews_count: ratingRow?.count || 0,
    });
  } catch (e) {
    console.error('stay get', e);
    return json(res, 500, { error: 'Failed to load stay' });
  }
}
