import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { prisma } from '../db.js';
import { requireAuth, requireCsrf } from '../middleware/auth.js';
import { safeUser, userInclude } from '../services/presenter.js';

const router = Router();
const profileSchema = z.object({ phone: z.string().trim().max(40).optional().nullable(), country: z.string().trim().max(80).optional().nullable(), birthday: z.string().date().optional().nullable(), language: z.string().trim().max(40).optional().nullable(), preferences: z.record(z.string(), z.string().trim().max(160)).optional() });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, done) => done(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) });

router.get('/profile', requireAuth, (req, res) => res.json({ user: safeUser(req.user) }));
router.patch('/profile', requireCsrf, requireAuth, async (req, res, next) => {
  try { const input = profileSchema.parse(req.body); const user = await prisma.user.update({ where: { id: req.user.id }, data: { phone: input.phone, profile: { upsert: { create: { country: input.country, birthday: input.birthday ? new Date(input.birthday) : null, language: input.language, preferences: input.preferences || {} }, update: { country: input.country, birthday: input.birthday ? new Date(input.birthday) : null, language: input.language, preferences: input.preferences } } } }, include: userInclude }); return res.json({ user: safeUser(user) }); } catch (error) { return next(error); }
});
router.post('/avatar', requireCsrf, requireAuth, (req, res, next) => upload.single('avatar')(req, res, (error) => error ? next(error) : next()), async (req, res, next) => {
  try { if (!req.file) return res.status(400).json({ error: 'Upload a PNG, JPEG, or WebP image under 2 MB.' }); const avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`; const user = await prisma.user.update({ where: { id: req.user.id }, data: { avatarUrl }, include: userInclude }); return res.json({ user: safeUser(user) }); } catch (error) { return next(error); }
});
export default router;
