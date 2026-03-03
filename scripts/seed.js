import './load-env.js';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from '../api/lib/auth.js';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!DATABASE_URL) {
  console.error('Set DATABASE_URL or POSTGRES_URL');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const STAY_IMAGES = [
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/285f1904ae-88f6e9cce57bea168ada.png',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/7c71187b34-bfecab2be60a8bb8f3cf.png',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/3c0c10e80f-824a064370575d7ac141.png',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/d4e5c7f891-5a2b3c4d8e9f0a1b2c3d.png',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/a1b2c3d4e5-f6a7b8c9d0e1f2a3b4c5.png',
];

const STAYS = [
  { title: 'Ocean View Villa with Private Pool', location: 'Malibu, California, USA', city: 'Malibu', country: 'USA', description: 'Experience luxury coastal living in this stunning oceanfront villa.', guests_max: 8, bedrooms: 4, baths: 3, price_per_night: 850, is_superhost: true, discount_percent: 20, free_cancellation: true, wifi: true, parking: true },
  { title: 'Elegant Apartment Near Eiffel Tower', location: '7th Arrondissement, Paris', city: 'Paris', country: 'France', description: 'Charming Parisian apartment with iconic views.', guests_max: 4, bedrooms: 2, baths: 1, price_per_night: 245, is_superhost: true, discount_percent: 25, free_cancellation: true, wifi: true, parking: false },
  { title: 'Santorini Cave House with Caldera View', location: 'Oia, Santorini, Greece', city: 'Santorini', country: 'Greece', description: 'Iconic white buildings & stunning sunsets.', guests_max: 4, bedrooms: 2, baths: 2, price_per_night: 420, is_superhost: true, discount_percent: 15, free_cancellation: true, wifi: true, parking: false },
  { title: 'Bali Rice Terrace Villa', location: 'Ubud, Bali, Indonesia', city: 'Ubud', country: 'Indonesia', description: 'Private villa surrounded by rice paddies.', guests_max: 6, bedrooms: 3, baths: 3, price_per_night: 320, is_superhost: true, discount_percent: 0, free_cancellation: true, wifi: true, parking: true },
  { title: 'Tokyo Modern Loft', location: 'Shibuya, Tokyo, Japan', city: 'Tokyo', country: 'Japan', description: 'Central Tokyo loft with skyline views.', guests_max: 3, bedrooms: 1, baths: 1, price_per_night: 180, is_superhost: false, discount_percent: 10, free_cancellation: true, wifi: true, parking: false },
  { title: 'Barcelona Beach Apartment', location: 'Barceloneta, Barcelona, Spain', city: 'Barcelona', country: 'Spain', description: 'Steps from the beach, vibrant neighborhood.', guests_max: 5, bedrooms: 2, baths: 2, price_per_night: 195, is_superhost: true, discount_percent: 0, free_cancellation: true, wifi: true, parking: false },
];

async function seed() {
  console.log('Seeding stays...');
  for (const s of STAYS) {
    const [stay] = await sql`
      INSERT INTO stays (title, location, city, country, description, guests_max, bedrooms, baths, price_per_night, is_superhost, discount_percent, free_cancellation, wifi, parking)
      VALUES (${s.title}, ${s.location}, ${s.city}, ${s.country}, ${s.description}, ${s.guests_max}, ${s.bedrooms}, ${s.baths}, ${s.price_per_night}, ${s.is_superhost}, ${s.discount_percent}, ${s.free_cancellation}, ${s.wifi}, ${s.parking})
      ON CONFLICT DO NOTHING
      RETURNING id
    `;
    if (stay) {
      for (let i = 0; i < STAY_IMAGES.length; i++) {
        await sql`INSERT INTO stay_images (stay_id, url, sort_order) VALUES (${stay.id}, ${STAY_IMAGES[i]}, ${i})`;
      }
      await sql`INSERT INTO rooms (stay_id, name, max_guests, bed_type, price_per_night, quantity_available) VALUES (${stay.id}, 'Standard Room', 2, 'King Bed', ${s.price_per_night}, 2)`;
      await sql`INSERT INTO rooms (stay_id, name, max_guests, bed_type, price_per_night, quantity_available) VALUES (${stay.id}, 'Deluxe Suite', 4, 'King Bed', ${s.price_per_night * 1.5}, 1)`;
    }
  }
  console.log('Creating demo user...');
  const pw = hashPassword('demo1234');
  await sql`
    INSERT INTO users (email, password_hash, full_name)
    VALUES ('demo@itinera.com', ${pw}, 'Demo User')
    ON CONFLICT (email) DO NOTHING
  `;
  console.log('Seed done.');
}

seed().catch((e) => { console.error(e); process.exit(1); });
