import 'dotenv/config';

const required = ['DATABASE_URL', 'SESSION_SECRET'];
export function env() {
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  return {
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET,
    frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5173',
    port: Number(process.env.API_PORT || 4000),
    cookieSecure: process.env.COOKIE_SECURE === 'true',
  };
}
