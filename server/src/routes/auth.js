import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../db.js';
import { loadUser, requireAuth, issueCsrf, requireCsrf } from '../middleware/auth.js';
import { safeUser, userInclude } from '../services/presenter.js';
import { audit, securityEvent } from '../services/audit.js';
import { emailConfigured, sendEmail } from '../services/email.js';

const router = Router();
const password = z.string().min(12, 'Password must be at least 12 characters.').max(128).refine((value) => /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value), 'Password must include uppercase, lowercase, and a number.');
const credentials = z.object({ email: z.string().email().max(254), password });
const signup = credentials.extend({ firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80) });
const resetRequest = z.object({ email: z.string().email().max(254) });
const resetConfirmation = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/), password });
const normalize = (email) => email.trim().toLowerCase();
const sessionUser = (req, user) => new Promise((resolve, reject) => req.session.regenerate((error) => { if (error) reject(error); else { req.session.userId = user.id; req.session.csrfToken = crypto.randomBytes(32).toString('hex'); req.session.save((saveError) => saveError ? reject(saveError) : resolve()); } }));

router.get('/me', loadUser, (req, res) => res.json({ user: safeUser(req.user) }));
router.get('/csrf', (req, res) => issueCsrf(req, res));
router.post('/register', async (req, res, next) => {
  try {
    const input = signup.parse(req.body); const email = normalize(input.email);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash, firstName: input.firstName, lastName: input.lastName, profile: { create: {} }, membership: { create: { tier: 'guest', activationSource: 'registration' } } }, include: userInclude });
    await sessionUser(req, user); await audit({ actorId: user.id, action: 'account.register', targetType: 'user', targetId: user.id });
    return res.status(201).json({ user: safeUser(user), csrfToken: req.session.csrfToken });
  } catch (error) { if (error.code === 'P2002') return res.status(409).json({ error: 'An account with this email already exists.' }); return next(error); }
});
router.post('/login', async (req, res, next) => {
  try {
    const input = credentials.parse(req.body); const email = normalize(input.email); const user = await prisma.user.findUnique({ where: { email }, include: userInclude });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash)) || user.status !== 'active') { await securityEvent({ userId: user?.id, kind: 'failed_login', severity: 'warning' }); return res.status(401).json({ error: 'The email or password you entered is incorrect.' }); }
    await sessionUser(req, user); await audit({ actorId: user.id, action: 'account.login', targetType: 'user', targetId: user.id });
    return res.json({ user: safeUser(user), csrfToken: req.session.csrfToken });
  } catch (error) { return next(error); }
});
router.post('/logout', requireCsrf, requireAuth, (req, res, next) => req.session.destroy((error) => error ? next(error) : res.clearCookie('al.sid').status(204).end()));
router.post('/password-reset', async (req, res, next) => {
  try {
    const { email } = resetRequest.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: normalize(email) }, select: { id: true, email: true } });
    if (user && emailConfigured()) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await prisma.$transaction([
        prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
        prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } }),
      ]);
      const origin = process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5173';
      const result = await sendEmail({ to: user.email, subject: 'Reset your AL password', text: `Use this one-hour, single-use link to reset your AL password: ${origin}/forgot-password?token=${rawToken}` });
      if (!result.delivered) await prisma.passwordResetToken.deleteMany({ where: { tokenHash } });
    }
    return res.status(202).json({ message: 'If an account exists, reset instructions will be sent when email delivery is configured.' });
  } catch (error) { return next(error); }
});
router.post('/password-reset/confirm', async (req, res, next) => {
  try {
    const input = resetConfirmation.parse(req.body);
    const tokenHash = crypto.createHash('sha256').update(input.token).digest('hex');
    const token = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!token || token.usedAt || token.expiresAt <= new Date()) return res.status(400).json({ error: 'This password-reset link is invalid or has expired.' });
    const passwordHash = await bcrypt.hash(input.password, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: token.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: token.userId, id: { not: token.id } } }),
      prisma.auditLog.create({ data: { actorId: token.userId, action: 'account.password_reset', targetType: 'user', targetId: token.userId, outcome: 'success' } }),
    ]);
    return res.status(204).end();
  } catch (error) { return next(error); }
});
export default router;
