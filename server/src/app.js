import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import auth from './routes/auth.js';
import account from './routes/account.js';
import favorites from './routes/favorites.js';
import membership from './routes/membership.js';
import developer from './routes/developer.js';
import health from './routes/health.js';
import { loadUser } from './middleware/auth.js';
import { securityEvent } from './services/audit.js';

export function createApp(config = env()) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
  app.use(cors({ origin: config.frontendOrigin, credentials: true, methods: ['GET', 'POST', 'PATCH', 'DELETE'] }));
  app.use(express.json({ limit: '100kb' }));
  const PgStore = connectPgSimple(session);
  app.use(session({store: new PgStore({ conString: config.databaseUrl, tableName: 'session', createTableIfMissing: true }), name: 'al.sid', secret: config.sessionSecret, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax', secure: config.cookieSecure, maxAge: 1000 * 60 * 60 * 24 * 7 } }));
  app.use(loadUser);
  const rateLimitHandler = (req, res) => {
    void securityEvent({ userId: req.user?.id, kind: 'rate_limit_exceeded', severity: 'warning' }).catch(() => {});
    res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  };
  const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, handler: rateLimitHandler });
  const sensitiveLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false, handler: rateLimitHandler });
  app.use('/api/auth/login', authLimit); app.use('/api/auth/register', authLimit); app.use('/api/auth/password-reset', authLimit);
  app.use('/api/account', sensitiveLimit); app.use('/api/favorites', sensitiveLimit); app.use('/api/membership', sensitiveLimit); app.use('/api/developer', sensitiveLimit);
  app.use('/api/health', health); app.use('/api/auth', auth); app.use('/api/account', account); app.use('/api/favorites', favorites); app.use('/api/membership', membership); app.use('/api/developer', developer);
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((error, _req, res, next) => { void next; if (error?.name === 'ZodError') return res.status(400).json({ error: 'Invalid request.', fields: error.flatten?.() }); if (error?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Avatar files must be 2 MB or smaller.' }); const status = error.status || 500; if (status >= 500) console.error(error); return res.status(status).json({ error: status >= 500 ? 'An unexpected error occurred.' : error.message }); });
  return app;
}
