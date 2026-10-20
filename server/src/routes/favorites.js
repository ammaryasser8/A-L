import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireCsrf } from '../middleware/auth.js';
const router = Router();
router.get('/', requireAuth, async (req, res, next) => { try { res.json({ favorites: await prisma.favorite.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } }) }); } catch (error) { next(error); } });
router.post('/', requireCsrf, requireAuth, async (req, res, next) => { try { const { productId } = z.object({ productId: z.string().trim().min(1).max(128) }).parse(req.body); const favorite = await prisma.favorite.upsert({ where: { userId_productId: { userId: req.user.id, productId } }, update: {}, create: { userId: req.user.id, productId } }); res.status(201).json({ favorite }); } catch (error) { next(error); } });
router.delete('/:productId', requireCsrf, requireAuth, async (req, res, next) => { try { await prisma.favorite.deleteMany({ where: { userId: req.user.id, productId: req.params.productId } }); res.status(204).end(); } catch (error) { next(error); } });
export default router;
