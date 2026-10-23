# Montra

Montra is a personal expense tracker for budgets and spending in Ethiopian birr (ETB), with AI-assisted entry and insights. It combines a customer dashboard, budget and expense management, receipt scanning, quick-add from plain text, spending insights, and an admin area for user and platform activity.

## Live demo

https://montra.base.et

## Features

### Budgets and expenses

- Create budgets with a name, an amount, and an emoji icon.
- Edit a budget's name, amount, and icon.
- Delete a budget after confirmation. Deleting a budget also deletes its expenses.
- Add expenses to a budget and delete them with a confirmation dialog and a 5-second undo window before the server delete runs.
- Amount input accepts shorthand such as `2500`, `250k`, and `1.43m`, with a maximum of ETB 100,000,000.
- Budget health bars show spending progress and change color as a budget nears or exceeds its limit.
- Expense search by name, sorting by name, amount, or date, and CSV export.
- Budget and expense amounts and names are validated on both the client and the server.

### Dashboards

- Customer dashboard with stat cards, a bar chart comparing budgeted amounts against spending, a donut chart of spending distribution, latest budgets, and an expense table.
- Admin dashboard, restricted by role, with user management and role changes, signup and daily expense charts, recent activity, and platform totals.

### AI features (Google Gemini)

- Quick add from text, for example a sentence describing an expense.
- Receipt scanning from a JPEG, PNG, or WebP image, compressed in the browser before upload.
- Spending insights generated from aggregated budget and expense data, with a refresh action.
- AI output is only used to prefill the expense form or display insights. It is never saved automatically.

### Authentication and accounts

- Email and password sign-up and sign-in with 6-digit email OTP verification.
- Forgot password flow with an emailed OTP and password reset.
- Google sign-in with account linking.
- Strong password rules: at least 8 characters with uppercase, lowercase, a number, and a special character.
- Full-name validation on the client and on the server.
- Change password from the settings page.
- Role-based routing after sign-in: admins go to `/admin`, other users go to `/dashboard`.
- Middleware protects dashboard and admin routes and blocks non-admin users from admin pages.

### Public pages

- Privacy policy at `/privacy`.
- Terms of service at `/terms`.
- Help center with searchable FAQs at `/help`.
- Contact page with a Resend-backed contact form at `/contact`.

### UI

- Light, dark, and system themes.
- Responsive layout with a collapsed mobile navigation.

## Tech stack

| Technology | Version | Role |
| --- | --- | --- |
| Next.js | 15.5.9 | App Router, server actions, route handlers |
| React | 19.1.0 | UI runtime |
| TypeScript | 5.9.2 | Application and schema types |
| Tailwind CSS | ^3.3.2 | Styling |
| shadcn/ui | n/a | Radix-based UI components |
| Recharts | ^2.15.4 | Bar, line, and donut charts |
| Better Auth | ^1.6.23 | Authentication, sessions, OTP, Google OAuth |
| Drizzle ORM | ^0.45.2 | Schema and queries |
| Neon Postgres | @neondatabase/serverless ^1.0.1 | Serverless Postgres over HTTP |
| Resend | ^6.32.1 | OTP and contact emails |
| Google Gemini | @google/genai ^2.30.0 | Quick add, receipt scanning, insights |
| zod | ^4.6.7 | AI output and contact form validation |
| Sonner | ^2.0.7 | Toasts and undo notifications |

## Architecture

### Auth

Better Auth uses the Drizzle adapter with the schema in `auth-schema.ts`. The email OTP plugin issues 6-digit codes that expire after 1 minute, and the app requires email verification before sign-in. Google OAuth is enabled with account linking for trusted Google accounts. A `role` column on the user table defaults to `user`.

Better Auth hooks enforce password rules on the server for sign-up, password reset, and password changes, and full-name validation on sign-up. `middleware.ts` calls the session endpoint, redirects unauthenticated users to sign-in, and redirects non-admin users away from `/admin`. Client pages also redirect by role through `/post-login`.

### Data

Drizzle talks to Neon over the HTTP driver (`drizzle-orm/neon-http`). Two schema choices are known quirks:

- `expenses.createdAt` is a `varchar` holding dates in `DD/MM/YYYY` format, so dates are parsed explicitly where chronological comparison is needed.
- `budgets.createdBy` stores the owner's email address rather than a user id.

The Neon HTTP driver has no interactive transactions. `deleteBudget` therefore deletes the budget's expenses and the budget itself with `db.batch`.

### Security

Dashboard and admin server actions re-read the Better Auth session instead of trusting client state. Budget and expense mutations verify ownership through `assertBudgetOwner` or an equivalent owner check. Amounts and names are validated on both the client and the server. Admin actions call `requireAdmin`, which checks the session role. The public contact action uses zod validation and in-memory rate limiting.

### AI layer

`lib/ai/gemini.ts` is a thin wrapper around the Gemini SDK. The client is created lazily, so importing the module or building the app does not require `GEMINI_API_KEY`. It accepts optional inline image input, requests JSON, and validates the result with zod. The model is read from `GEMINI_MODEL`.

All AI calls go through `lib/ai/guards.ts`, which provides:

- Per-user and global fixed-window rate limits.
- A 20-second default timeout, with longer per-feature limits for quick add, receipt scanning, and insights.
- One retry for 5xx and network failures, never for timeouts or rate limits.
- A cache keyed by user, feature, and a hash of the input. Concurrent identical requests share one call.
- Friendly error mapping and a guarantee that AI failures never throw to the caller.

Quick-add and receipt results only prefill the expense form. Insights are display-only.

### Request flow

```text
Browser
  |
  v
Next.js server actions / route handlers
  |
  v
Better Auth session check (role check for admin routes)
  |
  +--> Drizzle ORM --> Neon Postgres (HTTP)
  |
  +--> AI guards --> Google Gemini (quick add, receipt scan, insights)
  |
  v
Response (JSON, redirect, or server-rendered data)
```

## Getting started

### Prerequisites

- Node.js 20 LTS or newer. The repository has no `engines` field; Next.js 15 requires at least Node 18.18.
- A Neon Postgres database.
- A Resend account with a verified sending domain.
- A Google OAuth client for Google sign-in.
- A Gemini API key from Google AI Studio for AI features.

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repository-url>
   cd Expense_tracker
   npm install
   ```

2. Copy the example environment file and fill in your own values:

   ```bash
   cp .env.example .env
   ```

3. Apply the database schema without `drizzle-kit push`.

   Generate the SQL with Drizzle Kit, read it, and apply it with `psql`:

   ```bash
   npx drizzle-kit generate
   psql "$DATABASE_URL" -f drizzle/0000_gray_ulik.sql
   psql "$DATABASE_URL" -f drizzle/0001_bent_logan.sql
   ```

   The checked-in files in `drizzle/` are the baseline migrations. If `drizzle-kit generate` produces a new migration after a schema change, review that SQL and apply it with `psql` as well.

   Do not run `npm run db:push` or `npx drizzle-kit push`. Push can fail on an existing database when it tries to alter or cast the existing `amount` column.

4. Set the first admin after your account exists:

   ```sql
   UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The app runs at http://localhost:3000.

## Environment variables

| Variable | Required | Description | Example placeholder |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | Neon Postgres connection string used by Drizzle and `drizzle-kit`. | `postgresql://user:password@host/dbname?sslmode=require` |
| `BETTER_AUTH_SECRET` | Yes | Secret used by Better Auth to sign sessions and tokens. | `your_value_here` |
| `BETTER_AUTH_URL` | Yes in production | Public base URL of the app; used in trusted origins and auth callbacks. | `https://your-domain.example` |
| `RESEND_API_KEY` | Yes for email features | Resend API key for OTP and contact emails. | `your_value_here` |
| `RESEND_FROM_EMAIL` | Yes for email features | Verified sender shown on outgoing email. | `Montra <noreply@yourdomain.example>` |
| `GOOGLE_CLIENT_ID` | Yes for Google sign-in | Google OAuth client id. | `your_value_here` |
| `GOOGLE_CLIENT_SECRET` | Yes for Google sign-in | Google OAuth client secret. | `your_value_here` |
| `GEMINI_API_KEY` | Yes for AI features | Gemini API key from Google AI Studio. | `your_value_here` |
| `GEMINI_MODEL` | Optional | Gemini model name. Defaults to `gemini-3.5-flash-lite`. | `gemini-3.5-flash-lite` |
| `AI_USER_RPM` | Optional | Per-user AI requests per minute. Defaults to `5`. | `5` |
| `AI_USER_RPD` | Optional | Per-user AI requests per day. Defaults to `20`. | `20` |
| `AI_GLOBAL_RPM` | Optional | Global AI requests per minute. Defaults to `4`. | `4` |
| `AI_GLOBAL_RPD` | Optional | Global AI requests per day. Defaults to `15`. | `15` |

`SUPPORT_EMAIL` is not an environment variable in this repository. The contact form's destination address is defined in code.

## Deployment on Vercel

1. Import the repository into Vercel and set all required environment variables for both Production and Preview.
2. Set `BETTER_AUTH_URL` to the production URL, for example `https://your-domain.example`. The app's `trustedOrigins` list uses this value; add any additional origins, such as a preview domain, to that list in `lib/auth.ts`.
3. In Google Cloud Console, add the authorized redirect URI `https://<your-domain>/api/auth/callback/google` and the matching JavaScript origin.
4. Verify the sending domain in Resend and make sure `RESEND_FROM_EMAIL` uses that domain.
5. If the Neon connection string contains `channel_binding`, remove that parameter before using it with the serverless driver.
6. Do not run `drizzle-kit push` in production. Generate and review SQL locally, then apply it with `psql` against the production database.
7. Redeploy after changing environment variables so the new values take effect.

## Project structure

```text
app/
  (auth)/                  Sign-in, sign-up, forgot password, shared auth UI
  (routes)/dashboard/      Customer dashboard, budgets, expenses, settings
  (routes)/admin/          Admin dashboard and server actions
  api/auth/[...all]/       Better Auth route handler
  contact/                 Contact page and Resend-backed action
  help/                    Searchable help center
  privacy/                 Privacy policy
  terms/                   Terms of service
  about/ services/ pricing/ developers/   Marketing pages
components/                Landing page sections and shared UI
  ui/                      shadcn/ui primitives
lib/                       Auth, email, password, name, and formatting helpers
  ai/                      Gemini wrapper and shared AI guardrails
utils/                     Drizzle client and budget/expense schema
auth-schema.ts             Better Auth user, session, account, verification tables
drizzle/                   SQL migrations and Drizzle metadata
types/                     Shared TypeScript types
public/                    Static assets
```

## Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `npm run dev` | `next dev` | Start the development server. |
| `npm run build` | `next build` | Create a production build. |
| `npm run start` | `next start` | Start the production server. |
| `npm run lint` | `next lint` | Run the Next.js linter. |
| `npm run db:push` | `npx drizzle-kit push` | Push the schema directly. Avoid this on existing or production databases; use generated SQL with `psql` instead. |
| `npm run db:studio` | `npx drizzle-kit studio` | Open Drizzle Studio. |

## Known limitations

- AI rate limits and the cache are in-memory, so they are per serverless instance and approximate rather than globally exact.
- The Gemini free tier can return 503 responses or be slow.
- Expense dates stored as `DD/MM/YYYY` varchar and budget ownership stored by email are planned to be migrated.
- Receipt images are limited to 4 MB.
- Undo applies to expense deletion only; deleting a budget is permanent and also deletes its expenses.

## Roadmap

- Schema cleanup: timestamp-based dates and user-id foreign keys for budgets and expenses.
- Durable, shared AI rate limiting and caching.
- Automated tests for server actions, authentication flows, and AI guardrails.

## License

MIT License. Copyright (c) 2026 Firiko. See [LICENSE](LICENSE).
