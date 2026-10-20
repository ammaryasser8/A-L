import { Router } from 'express';
import { prisma } from '../db.js';
const router = Router();
router.get('/', async (_req, res) => { try { await prisma.$queryRaw`SELECT 1`; res.json({ status: 'ok', database: 'connected' }); } catch { res.status(503).json({ status: 'degraded', database: 'unavailable' }); } });
export default router;
