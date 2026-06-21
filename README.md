# BarberApp

> A modern barbershop management SaaS built with Next.js 15, focused on appointment scheduling, revenue tracking, and client management.

🔗 **Live Demo:** _coming soon_

---

## Demo

<!-- Add demo video here -->

---

## Features

- **Dashboard** — Revenue overview, appointment stats, top services and barbers with month-over-month comparison using equivalent period calculation
- **Appointments** — Full CRUD with drag-and-drop calendar (agenda view), status tracking, and multi-service support
- **Clients** — Client management with appointment history and notes
- **Barbers** — Barber management with individual revenue tracking
- **Services** — Service catalog with pricing and duration
- **Billing** — Revenue charts (daily and monthly), transactions table with date filters, and revenue breakdown by barber and service
- **Themes** — 8 built-in themes with light and dark mode support
- **Multi-tenant** — Each user has isolated data via Clerk authentication

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 with PgAdapter |
| Auth | Clerk |
| UI | shadcn/ui + Tailwind CSS v4 |
| Charts | Recharts |
| Tables | TanStack Table |
| Drag & Drop | dnd-kit |
| Date handling | date-fns + date-fns-tz |
| Validation | Zod |

---

## Architecture

```
src/
├── app/
│   ├── (dashboard)/        # Protected routes
│   │   ├── dashboard/      # Overview stats and charts
│   │   ├── agenda/         # Drag-and-drop calendar
│   │   ├── appointments/   # Appointments table with CRUD
│   │   ├── clients/        # Clients table with CRUD
│   │   ├── barbers/        # Barbers table with CRUD
│   │   ├── services/       # Services table with CRUD
│   │   └── billing/        # Revenue reports and transactions
│   └── api/
│       └── webhooks/       # Clerk webhook for user sync
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── shared/             # Reusable components (EmptyState, TablePagination, Skeletons)
├── lib/
│   ├── auth/               # Auth helpers
│   ├── data/               # DAL — database queries
│   ├── validations/        # Zod schemas
│   └── utils.ts            # Shared utilities
└── actions/                # Next.js Server Actions
```

**Key patterns:**
- Server Components for data fetching, Client Components for interactivity
- Server Actions for all mutations (create, update, delete)
- DAL (Data Access Layer) isolating all Prisma queries
- `Promise.all` for parallel database queries
- Timezone-aware date filtering using `date-fns-tz`

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Clerk account

### Installation

```bash
git clone https://github.com/luchersou/barber.git
cd barber
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

> **Note:** Before running the seed, sign in to the app once (Google login is supported). This triggers the Clerk webhook and creates your user in the database automatically.
> 1. Start the app with `npm run dev` and sign in
> 2. Open Prisma Studio with `npx prisma studio`
> 3. Copy your user `id` from the `User` table
> 4. Paste it into `prisma/seed.ts` as the `USER_ID` constant
> 5. Then run `npm run seed`

```bash
npm run seed       # optional: populate with realistic sample data
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database

```bash
npm run seed       # seed with 180 days of realistic appointment data
npm run reset      # wipe all data (keeps user table intact)
```

---

## License

MIT