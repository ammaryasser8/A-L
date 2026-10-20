import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { ADMIN_ROLE, userInclude } from '../services/presenter.js';
import { audit, securityEvent } from '../services/audit.js';

export async function loadUser(req, _res, next) {
  try {
    if (req.session?.userId) req.user = await prisma.user.findUnique({ where: { id: req.session.userId }, include: userInclude });
    next();
  } catch (error) { next(error); }
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
  if (req.user.status !== 'active') return res.status(403).json({ error: 'This account is unavailable.' });
  return next();
}

export async function requireCoFounder(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required.' });
  if (req.user.status !== 'active') return res.status(403).json({ error: 'This account is unavailable.' });
  if (!req.user.roles.some(({ role }) => role === ADMIN_ROLE)) {
    await securityEvent({ userId: req.user.id, kind: 'unauthorized_administrative_access', severity: 'warning' });
    return res.status(403).json({ error: 'Administrative authorization required.' });
  }
  return next();
}

export function issueCsrf(req, res) {
  const token = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = token;
  res.json({ csrfToken: token });
}

export function requireCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const token = req.get('x-csrf-token');
  if (!token || !req.session?.csrfToken || token.length !== req.session.csrfToken.length || !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(req.session.csrfToken))) return res.status(403).json({ error: 'Invalid request token.' });
  return next();
}

export async function auditedInspection(req, _res, next) {
  const reason = String(req.query.reason || '').trim();
  if (reason.length < 5 || reason.length > 500) return _res.status(400).json({ error: 'Provide an inspection reason between 5 and 500 characters.' });
  await audit({ actorId: req.user.id, action: 'account.inspect', targetType: 'user', targetId: req.params.userId, reason });
  return next();
}
