import { getSql } from '../lib/db.js';
import { cors, json } from '../lib/cors.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  try {
    const sql = getSql();
    const {
      destination,
      city,
      minPrice,
      maxPrice,
      guests,
      wifi,
      freeCancellation,
      sort = 'price_asc',
      limit = 50,
      offset = 0,
    } = req.query || {};

    let stays = await sql`
      SELECT s.id, s.title, s.location, s.city, s.country, s.guests_max, s.bedrooms, s.baths,
             s.price_per_night, s.currency, s.is_superhost, s.discount_percent, s.free_cancellation,
             s.wifi, s.parking, s.amenities,
             (SELECT url FROM stay_images WHERE stay_id = s.id ORDER BY sort_order LIMIT 1) AS image_url,
             (SELECT ROUND(AVG(r.rating)::numeric, 2) FROM reviews r WHERE r.stay_id = s.id) AS avg_rating,
             (SELECT COUNT(*)::int FROM reviews r WHERE r.stay_id = s.id) AS reviews_count
      FROM stays s
      WHERE 1=1
        ${destination ? sql`AND (s.location ILIKE ${'%' + destination + '%'} OR s.city ILIKE ${'%' + destination + '%'} OR s.country ILIKE ${'%' + destination + '%'})` : sql``}
        ${city ? sql`AND s.city ILIKE ${'%' + city + '%'}` : sql``}
        ${minPrice != null && minPrice !== '' ? sql`AND s.price_per_night >= ${Number(minPrice)}` : sql``}
        ${maxPrice != null && maxPrice !== '' ? sql`AND s.price_per_night <= ${Number(maxPrice)}` : sql``}
        ${guests ? sql`AND s.guests_max >= ${Number(guests)}` : sql``}
        ${wifi === 'true' ? sql`AND s.wifi = true` : sql``}
        ${freeCancellation === 'true' ? sql`AND s.free_cancellation = true` : sql``}
      ORDER BY
        ${sort === 'price_desc' ? sql`s.price_per_night DESC` : sort === 'rating' ? sql`avg_rating DESC NULLS LAST` : sql`s.price_per_night ASC`}
      LIMIT ${Math.min(Number(limit) || 50, 100)}
      OFFSET ${Number(offset) || 0}
    `;

    const ids = stays.map((s) => s.id);
    const images = ids.length
      ? await sql`SELECT stay_id, url, sort_order FROM stay_images WHERE stay_id = ANY(${ids}) ORDER BY stay_id, sort_order`
      : [];
    const byStay = {};
    images.forEach((img) => {
      if (!byStay[img.stay_id]) byStay[img.stay_id] = [];
      byStay[img.stay_id].push(img.url);
    });
    const result = stays.map((s) => ({
      ...s,
      images: byStay[s.id] || (s.image_url ? [s.image_url] : []),
      avg_rating: s.avg_rating ? Number(s.avg_rating) : null,
      reviews_count: s.reviews_count || 0,
    }));
    return json(res, 200, { stays: result, total: result.length });
  } catch (e) {
    console.error('stays list', e);
    return json(res, 500, { error: 'Failed to load stays' });
  }
}
