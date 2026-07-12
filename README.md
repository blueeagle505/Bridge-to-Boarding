# Bridge to Boarding

**Run by Boarding School Students. Built for Future Boarding School Students.**

Bridge to Boarding is a free, student-led mentorship platform that connects prospective
boarding school applicants with current boarding school students for admissions guidance —
essays, SSAT/ISEE prep, interviews, school selection, financial aid questions, and more.

This repository is the full production application: marketing site, authenticated applicant
and mentor dashboards, an admin console, transactional email, and a Postgres/Prisma data layer.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS, shadcn/ui-style components, Framer Motion
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth (Auth.js) with credentials login, bcrypt password hashing, email verification
- **Email:** Resend (with template-based transactional emails)
- **Validation:** Zod + React Hook Form
- **Testing:** Vitest

---

## 1. Prerequisites

- Node.js 18.18+ (Node 20 LTS recommended)
- A PostgreSQL database (local, or a hosted provider — Neon, Supabase, Vercel Postgres, Railway, RDS, etc.)
- A free [Resend](https://resend.com) account for sending email (optional for local dev — see below)

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

```bash
cp .env.example .env
```

Then fill in `.env`:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | e.g. `http://localhost:3000` in dev |
| `RESEND_API_KEY` | No | If unset, emails are logged to the console instead of sent — fine for local dev |
| `EMAIL_FROM` | No | Defaults to a Resend sandbox address |
| `CONTACT_INBOX_EMAIL` | No | Where contact-form messages are sent |
| `FIRST_ADMIN_EMAIL` / `FIRST_ADMIN_PASSWORD` | Yes, once | Used only by the one-time admin setup script below |

**No admin credentials are hardcoded anywhere in this codebase.** The first administrator is
created via the one-time script described in step 5, using the environment variables above.

## 4. Set up the database

```bash
npx prisma migrate dev --name init
```

This creates all tables (`User`, `Application`, `MentorProfile`, `Message`, `AdminNote`,
`Resource`, `AuditLog`, verification/reset tokens, etc.) as defined in `prisma/schema.prisma`.

## 5. Create the first administrator

With `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` set in `.env`:

```bash
npm run create-admin
```

This is a one-time step. It's safe to re-run — if an admin already exists, it does nothing.
**After this**, all future administrators must be added from the **Admin Users** page inside
the admin dashboard (`/admin/admins`) — not from environment variables or source code.

For extra safety, remove `FIRST_ADMIN_PASSWORD` from your `.env` / hosting provider's
environment variables after this step.

## 6. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign in with your admin account at `/signin`, or create a
regular account at `/signup` to try the applicant flow.

## 7. Run tests

```bash
npm run test
```

---

## How authentication & roles work

- Every user signs up with first/last name, email, and password (bcrypt-hashed, 12 rounds).
- New accounts must **verify their email** (a signed, expiring token emailed via Resend)
  before they can submit an application — enforced both client-side and server-side.
- Three roles: `APPLICANT` (default), `MENTOR` (granted automatically when an admin approves
  a mentor application), and `ADMIN` (granted only via the first-admin script or by an
  existing admin).
- `src/middleware.ts` enforces role-based route protection for `/dashboard`, `/mentor/*`, and
  `/admin/*`. API routes independently re-check roles via `requireRole()` in `src/lib/rbac.ts`
  — the UI routing is a convenience, not the security boundary.

## Application lifecycle

`DRAFT → SUBMITTED → UNDER_REVIEW → MENTOR_ASSIGNED` (or `WAITLISTED` / `REJECTED` at any
review point, with `CLOSED` as a terminal admin action). Every transition that should notify
the student sends an email automatically (see `src/lib/email.ts` and `src/emails/templates.ts`).

## Project structure

```
src/
  app/                    Routes (App Router) — public pages, auth pages, dashboards, API routes
    api/                  All server-side API routes (auth, applications, admin actions, etc.)
    admin/                Admin console (dashboard, applications, mentors, admin users)
    mentor/dashboard/     Mentor console
    dashboard/            Applicant dashboard
  components/
    ui/                   Reusable primitives (button, input, accordion, etc.)
    sections/             Landing-page sections (hero, trust, FAQ, etc.)
  lib/                    db client, auth config, email, validation schemas, RBAC helpers, utils
  emails/                 HTML email templates
  middleware.ts           Route-level RBAC enforcement
prisma/
  schema.prisma           Full data model
scripts/
  create-first-admin.ts   One-time admin bootstrap script
tests/                    Vitest unit tests
```

## Security notes

- Passwords are hashed with bcrypt (12 rounds) — never stored or logged in plaintext.
- All mutating API routes validate input with Zod and re-check the caller's role server-side.
- Sensitive routes (`/register`, `/forgot-password`, `/contact`, application submission) are
  rate-limited per IP/user (see `rateLimit()` in `src/lib/utils.ts`). The included limiter is
  in-memory and fine for a single instance; swap in a Redis-backed limiter (e.g. Upstash) for
  multi-instance deployments — call sites don't need to change.
- Password reset and email verification tokens are single-use, random (32-byte), and expire
  (1 hour and 24 hours respectively).
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy) are set globally in `next.config.mjs`.
- Admin/mentor-only data (private notes, full application detail) is never returned by the
  applicant-facing API routes.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add all variables from `.env.example` in the Vercel project's Environment Variables settings
   (use a production `DATABASE_URL`, a fresh `NEXTAUTH_SECRET`, and your production `NEXTAUTH_URL`).
4. Set the build command to `npm run build` (already the default — it runs `prisma generate`
   before `next build`).
5. After the first deploy, run the Prisma migration against your production database:
   ```bash
   npx prisma migrate deploy
   ```
   (Run this from your local machine with `DATABASE_URL` pointed at production, or via a
   one-off Vercel deployment hook / CI step.)
6. Run `npm run create-admin` once against the production database the same way, then remove
   `FIRST_ADMIN_PASSWORD` from your Vercel environment variables.

## What's intentionally left as a placeholder

In the spirit of shipping something real rather than something fake: a few things are clearly
marked rather than faked with placeholder logic that pretends to work:

- **Resource PDFs** (`/resources`) show real titles and descriptions but the download buttons
  are disabled with an explanatory tooltip, since no actual guide content was provided. Wire
  `Resource.fileUrl` (already in the schema) up to real files (e.g. Vercel Blob storage) and
  flip the buttons on.
- **Campus imagery** uses elegant gradient placeholders instead of stock photography, since
  sourcing properly licensed photos of specific schools isn't something this app can do on its
  own — swap in licensed images via `next/image` wherever you see a placeholder block.
- **Email delivery** falls back to console logging if `RESEND_API_KEY` isn't set, so the full
  flow (signup → verify → apply → admin review → mentor match) is testable end-to-end locally
  without an email provider.

Everything else — auth, RBAC, the full application/review/assignment workflow, messaging,
admin analytics, and the marketing site — is real, working code, not a stub.
