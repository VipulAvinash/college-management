# College Management System (Backend-First, Admin-Only)

A monolithic Next.js application for managing college data: students, faculty,
departments, courses, fees, fee payments, and announcements. Only the
**Admin** authenticates; students and faculty exist purely as data records.

## 1. Project Overview

- Admin logs in and manages all college data through a REST-style API and a
  minimal admin dashboard UI.
- Students and faculty have **no accounts, passwords, or sessions** - they
  are managed entirely by the admin.
- No file/image/PDF uploads anywhere in the system.
- Fee payments are recorded manually by the admin (no payment gateway) and
  automatically recalculate the related fee's paid/pending amount and status
  inside a single database transaction.

## 2. Tech Stack

| Concern              | Choice                              |
|----------------------|--------------------------------------|
| Framework            | Next.js 14 (App Router)             |
| Language             | TypeScript (strict mode)            |
| Database             | PostgreSQL                          |
| ORM                  | Drizzle ORM                         |
| Validation           | Zod                                 |
| Password hashing     | Argon2id (`argon2` package)         |
| Auth                 | DB-backed sessions + HTTP-only cookie |
| API style            | REST via Next.js Route Handlers     |

## 3. Requirements

- Node.js 20+
- PostgreSQL 14+
- npm

## 4. Installation

```bash
npm install
cp .env.example .env
# edit .env with your DATABASE_URL and a random AUTH_SECRET
```

## 5. Environment Variables

See `.env.example`:

- `DATABASE_URL` - PostgreSQL connection string.
- `AUTH_SECRET` - long random string, reserved for future signing needs.
- `NEXT_PUBLIC_APP_URL` - public URL of the app.
- `SESSION_TTL_SECONDS` - how long a login session lasts (default 7 days).

## 6. Database Setup

Create an empty PostgreSQL database matching `DATABASE_URL`, e.g.:

```bash
createdb college_mgmt
```

## 7. Drizzle Migrations

```bash
npm run db:generate   # generates SQL migration files from src/db/schema
npm run db:migrate    # applies migrations to the database
```

`db:push` is also available for quick local iteration (skips migration
files) - prefer `generate` + `migrate` for anything beyond local prototyping.

## 8. Seed the Database

```bash
npm run db:seed
```

Creates:
- 1 admin user (`admin@college.com` / `Admin@123` - **development credential,
  change immediately in any real deployment**)
- 5 departments, 6 courses, 10 students, 5 faculty
- 1 fee record per student (2025-26) and 4 sample payments
- 4 sample announcements

## 9. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, `/login` to sign in as
admin, and `/admin` for the dashboard.

## 10. Production Build

```bash
npm run build
npm run start
```

## 11. Authentication

- Single role: `ADMIN`. Students and faculty are plain database rows with
  no login capability, by design - this can be extended later without
  restructuring the `users` table (see `API.md` and inline comments in
  `src/lib/auth/session.ts`).
- Sessions are stored in the `sessions` table and referenced by an opaque,
  `httpOnly`, `sameSite=lax` cookie (`secure` in production). No JWT, no
  localStorage.
- Every admin API route calls `requireAdmin()` server-side, independent of
  `middleware.ts` (which only redirects unauthenticated page loads for UX -
  it is not a security boundary by itself).

## 12. Project Structure

```
src/
├── app/                 # Pages (public site, /login, /admin/*) + API routes
│   └── api/             # REST route handlers (thin - delegate to services)
├── db/
│   ├── schema/          # Drizzle table definitions, one file per table
│   ├── migrations/      # Generated SQL migrations
│   ├── index.ts         # DB client
│   ├── migrate.ts       # Migration runner
│   └── seed.ts          # Seed script
├── services/            # Business logic (validation of business rules,
│                         # transactions, cross-entity checks)
├── repositories/        # Raw Drizzle queries only - no business logic
├── lib/
│   ├── auth/            # password hashing, session mgmt, permissions
│   ├── validations/     # Zod schemas per module
│   ├── errors/          # Central AppError hierarchy
│   ├── api/             # response helpers, pagination, error-handling wrapper
│   └── utils/
├── types/
└── middleware.ts         # Redirects unauthenticated /admin/* page loads
```

Request flow: `Route Handler -> requireAdmin() -> Zod validation -> Service
(business rules, transactions) -> Repository (Drizzle queries) -> PostgreSQL`.

## Deviations / Decisions Made Where Requirements Were Ambiguous

- **Deleting departments/courses**: blocked (400) if dependent records
  exist, rather than cascading or silently deactivating. Reassign/remove
  dependents first. This avoids accidental data loss.
- **Deleting a student**: hard-deletes the student row; `fees`/`fee_payments`
  cascade via FK `ON DELETE CASCADE` since they are meaningless without the
  student. If you need to retain financial history after a student leaves,
  set `status = INACTIVE`/`GRADUATED` via `PATCH /api/students/:id` instead
  of deleting.
- **Rate limiting on login**: no Redis/external service added for a first
  version (per requirement #33/#30). Recommended approach: add a small
  in-memory or Postgres-backed counter (e.g. a `login_attempts` table keyed
  by IP+email) if you need it before introducing Redis; only reach for
  Redis once you run multiple app instances and need shared state.
- **Public website content** (about/contact/admissions text): kept out of
  the database for v1 since it's static marketing copy; announcements are
  the one piece of dynamic public content, per requirement #20's "keep this
  extensible, avoid complex CMS" guidance. Add a `pages` table later if this
  content needs to become admin-editable.
