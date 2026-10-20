# AL Hospitality

AL Hospitality is a Vite/React single-page app with an Express, Prisma, and PostgreSQL API. The API lives in `server/`; Vercel runs it through `api/[...path].js` as a Node.js function.

## Local development

```powershell
npm install
npm --workspace server run prisma:generate
npm run dev:server
```

In a second terminal, run `npm run dev`.

## Vercel

Import the repository with its root directory set to this folder. The included `vercel.json` builds the frontend, generates Prisma Client, exposes `/api/*`, and sends SPA routes to `index.html`.

Set these Vercel environment variables before deploying:

- `DATABASE_URL` — production PostgreSQL connection string
- `SESSION_SECRET` — a unique random value of at least 32 characters
- `FRONTEND_ORIGIN` — the exact deployed site origin, for example `https://your-project.vercel.app`
- `COOKIE_SECURE=true`
- `COFOUNDER_EMAILS` — the two approved co-founder email addresses

Optional SMTP variables are documented in `.env.example`. Run `npm run db:deploy` with the production `DATABASE_URL` before accepting real traffic; see `SETUP.md`.
