import 'dotenv/config';
import { prisma } from '../db.js';
import { ADMIN_ROLE } from '../services/presenter.js';

const emails = (process.env.COFOUNDER_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
if (emails.length !== 2 || new Set(emails).size !== 2) throw new Error('COFOUNDER_EMAILS must contain exactly two different, pre-existing account emails.');
const users = await prisma.user.findMany({ where: { email: { in: emails } }, select: { id: true, email: true } });
if (users.length !== 2) throw new Error('Both designated accounts must exist before role provisioning. No changes were made.');
await prisma.$transaction(async (tx) => { for (const user of users) { await tx.roleAssignment.upsert({ where: { userId_role: { userId: user.id, role: ADMIN_ROLE } }, create: { userId: user.id, role: ADMIN_ROLE }, update: {} }); await tx.auditLog.create({ data: { action: 'role.provisioned', targetType: 'user', targetId: user.id, outcome: 'success', metadata: { role: ADMIN_ROLE, provisioning: 'co_founder_pair' } } }); } });
const assigned = await prisma.roleAssignment.findMany({ where: { role: ADMIN_ROLE, userId: { in: users.map(({ id }) => id) } }, select: { userId: true, role: true } });
if (assigned.length !== 2 || assigned.some(({ role }) => role !== ADMIN_ROLE)) throw new Error('Provisioning verification failed.');
console.log(`Provisioned equal ${ADMIN_ROLE} access for ${users.length} designated accounts.`);
await prisma.$disconnect();
