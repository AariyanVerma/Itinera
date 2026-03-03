import { SignJWT, jwtVerify } from 'jose';
import { getSql } from './db.js';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'itinera-dev-secret-change-in-production'
);
const TOKEN_EXP = '7d';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return verify === hash;
}

export async function createToken(userId, email) {
  return await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXP)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function getAuthHeader(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function requireAuth(req) {
  const token = getAuthHeader(req);
  if (!token) return { ok: false, status: 401, body: { error: 'Not authenticated' } };
  const payload = await verifyToken(token);
  if (!payload) return { ok: false, status: 401, body: { error: 'Invalid or expired token' } };
  return { ok: true, userId: payload.userId, email: payload.email };
}
