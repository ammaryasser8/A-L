import { prisma } from '../db.js';
export async function audit({ actorId = null, action, targetType, targetId = null, outcome = 'success', reason = null, metadata = null }) {
  return prisma.auditLog.create({ data: { actorId, action, targetType, targetId, outcome, reason, metadata } });
}
export async function securityEvent({ userId = null, kind, severity = 'info', ipHash = null, detail = null }) {
  return prisma.securityEvent.create({ data: { userId, kind, severity, ipHash, detail } });
}
