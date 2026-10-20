# Backend implementation status

## Completed in source

- Express API with PostgreSQL/Prisma models, an initial migration, and a password-reset-token migration.
- HttpOnly PostgreSQL-backed sessions, password hashing, security headers, CORS restrictions, rate limiting with security-event recording, input validation, CSRF tokens, and safe API error responses.
- Registration, login, logout, current-session restoration, profile updates, safe avatar uploads, and password-reset response handling.
- User-owned server-persisted favorites.
- Manual membership-application workflow. Applications remain pending until a co-founder approves or rejects them in a database transaction.
- Persistent `co_founder_developer` role, the identical `Co-Founder & Developer` title and permissions for both co-founders, an idempotent server-side provisioner, audit logs, security events, and protected developer APIs.
- Password reset now uses a server-stored, hashed, one-hour, single-use token whenever SMTP is configured; it deliberately does not pretend to email a link when SMTP is absent.
- Frontend authentication now uses the API; social sign-in is explicitly unavailable until OAuth is configured. The account membership page submits applications instead of pretending that a payment or instant activation occurred.
- `/developer` is client-gated for presentation and its API is independently server-authorized. It now provides live overview, paginated account search/filtering, reason-recorded account inspection, protected suspend/restore actions, membership approvals/rejections with notes, and security-event review.
- The authenticated server session is authoritative for the co-founder badge, membership, and administrative navigation; browser storage cannot override them.

## Verified locally

- Prisma schema validation/client generation completed after adding the password-reset-token migration.
- Frontend linting and production build completed.
- Server unit tests verify equal effective co-founder permissions, a privilege membership has no administrative identity, and unauthenticated administrative requests are rejected.

## Not yet verifiable in this workspace

- No PostgreSQL connection details or running database were supplied, so migrations, account creation, the two-account provisioning command, real login, and end-to-end API tests have not been executed.
- The shared role has therefore **not** been assigned to either designated email yet. Follow `SETUP.md` after configuring PostgreSQL and creating both accounts.

## Intentionally mock-only features

Existing reservations, booking payment screens, concierge, reviews, documents, notifications, activity history, and existing billing records remain frontend mock features. No real payment gateway or card collection was added.
