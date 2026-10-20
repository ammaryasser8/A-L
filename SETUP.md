# AL Hospitality full-stack setup

## Prerequisites

Install Node.js 20+ and PostgreSQL 15+. Create an empty PostgreSQL database for AL Hospitality.

## Configure

Copy `.env.example` to `server/.env`, then set a real `DATABASE_URL` and a randomly generated `SESSION_SECRET` (at least 32 characters). Keep `COOKIE_SECURE=false` locally and set it to `true` behind HTTPS.

Set `COFOUNDER_EMAILS` to the two designated, already-created accounts. This is server-only configuration and is intentionally not present in the frontend or committed source.

Optional SMTP variables enable delivery of membership notifications and the secure one-hour password-reset link. When SMTP is absent, password-reset requests still return a privacy-preserving generic response but no token is issued or delivered.

## Install and run

From the project root:

```powershell
npm install
Set-Location server
npm install
npm run prisma:generate
npm run prisma:migrate
Set-Location ..
npm run dev:server
```

In another terminal, run `npm run dev`. Vite proxies `/api` and `/uploads` to the local API.

## Secure co-founder provisioning

1. Each designated person must create their own account through the normal registration page using the configured email address.
2. Confirm both accounts exist in the database.
3. Run `npm run provision:cofounders` from the project root.
4. Have each person sign in and verify `/developer` access.

The provisioner is idempotent, only reads the two server-configured email addresses, assigns the identical `co_founder_developer` role to both, and records audit entries. It never creates passwords or exposes credentials. Do not run it with a different pair unless the designated accounts are intentionally being changed.

## Production notes

Use HTTPS, set a strict production `FRONTEND_ORIGIN`, set `COOKIE_SECURE=true`, run migrations during deployment, and configure a monitored SMTP provider. Avatar images are stored in the database as validated, size-limited data URLs so they work in Vercel's stateless runtime; move them to object storage if high-volume image uploads are expected. Booking, concierge, reviews, documents, notifications, and billing that predate this work remain frontend mock services; no payment processing is implemented.

## Vercel deployment

The repository root is deployment-ready. `vercel.json` serves the Vite SPA, routes `/api/*` to the Express function, and runs Prisma Client generation before the frontend build. In Vercel Project Settings, set `DATABASE_URL`, `SESSION_SECRET`, `FRONTEND_ORIGIN`, `COOKIE_SECURE=true`, and `COFOUNDER_EMAILS` for Production (and separately for Preview if preview authentication is needed). Apply the Prisma migrations to the production database with `npm run db:deploy` before the first deployment.
