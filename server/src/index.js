import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './db.js';
const config = env(); const app = createApp(config);
const server = app.listen(config.port, () => console.log(`AL Hospitality API listening on ${config.port}`));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, async () => { server.close(); await prisma.$disconnect(); process.exit(0); });
