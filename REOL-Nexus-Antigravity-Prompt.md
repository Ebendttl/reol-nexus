# REOL NEXUS — Multi-Business Operations & Financial Command Center
### A God-Tier Build Prompt for Antigravity IDE

---

## 0. Why this isn't "just" an Event Financial Tracker

The original brief (event center + daily profit reports + push notifications) is a single-tenant accounting widget. But REOL GLOBAL SOLUTIONS LIMITED actually runs **a property with multiple revenue-generating business units under one roof**: an event center, an eatery, a laundry service, and "one or two others" that will show up eventually (maybe a shortlet/hotel wing, a car wash, a mini-mart).

A 30-year engineer doesn't build four separate apps, and doesn't build one monolithic "event app" and bolt the rest on later as a hack. The correct shape is:

> **One multi-business-unit ERP-lite platform, with a shared core (auth, people, money, notifications, audit) and pluggable "Business Unit Modules"** (Event Center, Eatery, Laundry, ...) that all post into a single unified ledger the owner can see at a glance.

This is the difference between software that gets rewritten in 12 months and software that scales for a decade. Below is the product thinking, the architecture, the data model, and finally — the actual copy-pasteable prompt to give Antigravity.

---

## 1. Product Vision

**Product name:** REOL Nexus
**Tagline:** *"One roof. Every business. One number that matters: profit."*

**Owner persona:** A non-technical but financially sharp business owner (REOL GLOBAL SOLUTIONS LIMITED) who wants, every single day, one honest answer: *"Did we make money today, across everything I own, and where did it leak?"*

**Core insight driving the architecture:** Every business unit (event hall, eatery, laundry) is structurally the same financial object — it has *income transactions*, *expense transactions*, *inventory or bookings*, *staff who record activity*, and *a daily close*. So instead of modeling "Event Bookings" and "Laundry Orders" as unrelated tables, we model a shared `transactions` and `business_units` core, and let each unit have its own thin "operational" layer (bookings for events, orders for laundry, tickets for the eatery) that ultimately resolves into the same financial ledger.

---

## 2. Business Units (MVP scope vs. future)

| Business Unit | MVP? | Operational concept | Financial concept |
|---|---|---|---|
| **Event Center** | ✅ Yes | Bookings/Reservations (date, hall, client, package) | Income (booking fees, deposits), Expenses (decor, catering staff, cleaning, security) |
| **Eatery** | ✅ Yes | Daily sales sessions, menu items, simple POS-style entry | Income (food sales), Expenses (ingredients/inventory, staff, gas/utility) |
| **Laundry** | ✅ Yes | Orders (customer, items, drop-off/pickup, status) | Income (service fees), Expenses (detergent/supplies, utility, staff) |
| **Future unit #4 (shortlet/hotel, car wash, mini-mart, etc.)** | 🔜 Phase 2 | Defined by a generic "Business Unit" schema — no code rewrite needed | Same ledger pattern |
| **Property-wide overheads** | ✅ Yes | Rent/mortgage, generator diesel, security, general staff, utility bills | Allocated across units or kept at "HQ" level |

This is why the data model below treats "Business Unit" as a *first-class configurable entity*, not a hardcoded enum — so REOL can literally add "Car Wash" from the admin UI in 2027 without a developer touching the database schema.

---

## 3. Information Architecture (Apps & Roles)

**One Next.js codebase, mobile-first, three experiences gated by role:**

1. **Owner/Admin Dashboard** — REOL (or his finance manager): cross-unit P&L, daily digest, budgets, approvals, user management, audit log.
2. **Unit Manager Console** — Each business unit (Event Center, Eatery, Laundry) has its own manager who logs *only their unit's* daily income/expenses/bookings. Strict scoping — a laundry manager never sees eatery numbers unless given cross-unit permission.
3. **Staff/Operator Lite View** (Phase 2) — front-desk/cashier-level data entry, no financial visibility, just "record a sale" or "record a booking."

This role separation is the difference between a tool REOL trusts with real money and a toy.

---

## 4. Tech Stack (Recommended — Supabase over Firebase)

You're a React/Next dev, so:

| Layer | Choice | Why this beats the original Firebase suggestion |
|---|---|---|
| **Framework** | **Next.js 14+ (App Router)**, TypeScript, mobile-first responsive design (PWA-ready) | SSR for fast dashboards, file-based routing, API routes for backend logic, installable as a home-screen PWA on Android/iOS today — no app store needed for v1 |
| **Backend/DB** | **Supabase** (Postgres + Auth + Storage + Realtime + Edge Functions) | Real relational SQL (financial data is *inherently relational* — Firestore's NoSQL document model fights you on every report/JOIN you'll need). Postgres gives you proper transactions, foreign keys, and SQL aggregation for P&L reports. Row Level Security (RLS) gives you bank-grade per-business-unit data isolation natively. |
| **Auth** | Supabase Auth (email/password + Google OAuth + optional phone OTP) | Built-in, integrates with RLS via `auth.uid()` |
| **State/data fetching** | TanStack Query (React Query) + Supabase client | Caching, optimistic updates, background refetch — essential for a dashboard people check daily |
| **UI Kit** | **shadcn/ui** + Tailwind CSS | Modern, accessible, fully ownable components (not a black-box library) — perfect for an "award-winning" feel |
| **Charts** | Recharts or Tremor | Clean financial visualizations (KPIs, trend lines, category breakdowns) |
| **Forms** | React Hook Form + Zod | Type-safe validation for financial entry forms (no bad data in, no bad reports out) |
| **Push/Notifications (web)** | Web Push API (via service worker) for MVP; **OneSignal** or Supabase + Expo push later for native mobile | Skip Firebase Cloud Messaging entirely if you're not on Firebase — OneSignal is stack-agnostic and dead simple |
| **Daily digest delivery** | Supabase **Edge Function** (cron via `pg_cron` or Supabase Scheduled Functions) that runs at a configurable time, aggregates the day's numbers, and sends via Web Push + email (Resend.com) | Decouples "the report exists" from "the report got pushed" |
| **PDF/Excel export** | `@react-pdf/renderer` or `pdf-lib` for PDF; `exceljs` for Excel; CSV is trivial | All client-/edge-runnable, no heavy server needed |
| **File/Image storage** (logos, receipts) | Supabase Storage | Same ecosystem, RLS-protected buckets |
| **Hosting** | Vercel (frontend) + Supabase Cloud (backend) | Zero-DevOps for a solo/small dev team, scales automatically |
| **Future native app** | **Expo (React Native)** sharing the same Supabase backend, same business logic, same TypeScript types | This is exactly why we pick Supabase now — Expo + Supabase is a first-class, well-documented combo; you reuse 80% of your data layer |
| **Monorepo** | Turborepo (optional but recommended even at MVP) with `apps/web` now, `apps/mobile` later, `packages/shared` for types/business-logic/Supabase client | Sets you up so Phase 2 (Expo) is "add an app," not "start over" |

---

## 5. Core Data Model (Postgres / Supabase)

```
organizations            -- REOL GLOBAL SOLUTIONS LIMITED (future: support more than one org/client)
  id, name, logo_url, branding_color, created_at

business_units           -- Event Center, Eatery, Laundry, (future units)
  id, org_id, name, slug, type (enum: event_center | eatery | laundry | custom),
  icon, color, is_active, created_at

users (extends Supabase auth.users via profile table)
  id, org_id, full_name, phone, avatar_url, default_business_unit_id, created_at

roles                    -- Admin, Owner, Unit Manager, Finance Viewer, Report Generator, Staff
  id, org_id, name, is_system_role

permissions               -- granular: view_financials, export_reports, manage_users,
  id, code, description    set_budgets, approve_expenses, manage_units, view_all_units, etc.

role_permissions (join table)

user_roles (join table)   -- supports a user having a role scoped to ONE business unit
  id, user_id, role_id, business_unit_id (nullable = org-wide)

transactions              -- THE UNIFIED LEDGER — every unit posts here
  id, org_id, business_unit_id, type (income | expense),
  category_id, subcategory_id, amount, currency, description,
  transaction_date, recorded_by (user_id), source (manual | booking | order | sale | import),
  source_ref_id (nullable FK to bookings/orders/sales), attachment_url, created_at, updated_at

categories                -- e.g. Venue, Catering, Decor, Utilities, Inventory, Staff Wages
  id, org_id, business_unit_id (nullable = applies org-wide), name, type (income|expense)

subcategories
  id, category_id, name

budgets
  id, business_unit_id, period_start, period_end, total_amount, status (draft|active|closed)

budget_line_items
  id, budget_id, category_id, allocated_amount

-- EVENT CENTER MODULE
event_bookings
  id, business_unit_id, client_name, client_contact, event_date, package_type,
  hall_name, deposit_amount, total_quoted, status (inquiry|confirmed|completed|cancelled), notes

-- EATERY MODULE
menu_items
  id, business_unit_id, name, price, category, is_active

eatery_daily_sales
  id, business_unit_id, sale_date, total_covers, total_revenue, recorded_by

-- LAUNDRY MODULE
laundry_orders
  id, business_unit_id, customer_name, customer_contact, items_description,
  drop_off_date, pickup_date, status (received|in_progress|ready|collected),
  amount_charged

-- SHARED
daily_summaries           -- materialized/cached per business_unit per day for fast dashboard loads
  id, business_unit_id, summary_date, total_income, total_expense, net_profit,
  vs_previous_day_pct, generated_at

audit_logs
  id, org_id, user_id, action, entity_type, entity_id, metadata (jsonb), ip_address, created_at

notification_preferences
  id, user_id, channel (push|email|sms), delivery_time, frequency (daily|weekly), is_enabled

device_tokens              -- for future Expo push notifications
  id, user_id, token, platform (ios|android|web), created_at
```

**Key design decisions baked into this schema:**
- `transactions` is the single source of truth for every Naira (₦) that moves, regardless of which unit or module generated it — so a cross-unit P&L is always just `SELECT ... GROUP BY business_unit_id`, never a painful manual reconciliation.
- `business_units.type = 'custom'` plus a flexible `categories` table means a 4th business unit can be added via the admin UI with zero schema migration for simple cases.
- RLS policies are written against `business_unit_id` + `user_roles`, so a Laundry manager's queries are *physically incapable* of returning Eatery rows — security at the database layer, not just hidden in the UI.

---

## 6. Feature Set (Prioritized)

### MVP (Phase 1 — ship this first, ~6-8 weeks solo)
- Auth (email/password + Google) with org + role-based access
- Admin can create/manage business units, categories, users, roles & permissions
- Each unit manager has a daily entry form (income/expense, with category/subcategory)
- Owner dashboard: today's summary, per-unit breakdown, org-wide total, vs-yesterday %
- Historical view with date-range filter + line/bar charts (Recharts)
- Budget vs actual per business unit, with variance %, and 80%-threshold alerts
- CSV + PDF export (daily/weekly/monthly/custom range), branded with REOL logo
- Web Push daily digest at a configurable time, tap-to-open
- Full audit log of every financial entry (who, what, when)
- Mobile-first responsive UI, installable as PWA
- Basic Event Bookings table (so the Event Center unit has real operational substance, not just a manual ledger)

### Phase 1.5 (fast follow, ~2-3 weeks)
- Laundry Orders tracking (status pipeline) auto-posting to ledger on "collected + paid"
- Eatery daily sales quick-entry (simple POS-lite, not full inventory yet)
- Role hierarchy refinement (Admin > Owner > Unit Manager > Finance Viewer)
- Notification customization: frequency, channel, content detail level
- Multi-factor authentication for Admin role

### Phase 2 (Expo mobile app + scale-out)
- Expo app reusing Supabase client + shared TypeScript types from the monorepo
- Native push via Expo Push Notifications
- Inventory management for Eatery (stock levels, low-stock alerts) and Laundry (supplies)
- Ability to add new business units (Car Wash, Shortlet rooms, Mini-mart) purely via config
- Year-over-year trend analysis, seasonal forecasting
- In-app messaging between Owner and Unit Managers
- GDPR/NDPR-aligned data retention & consent tooling (Nigeria's NDPR is the relevant regime, not GDPR — worth flagging to the client)

---

## 7. Suggested GitHub Repository Name

```
reol-nexus
```

Full suggested repo path: `github.com/<your-username>/reol-nexus`

- Short, brandable, not tied to "event" only (since it's multi-business) — protects you from a confusing rename in 6 months when the laundry/eatery modules ship.
- Suggested monorepo internal naming: `apps/web` (Next.js), `apps/mobile` (Expo, added later), `packages/database` (Supabase types/migrations), `packages/ui` (shared shadcn components), `packages/config` (shared eslint/tsconfig).
- Suggested package scope if you publish internal packages: `@reol-nexus/*`

---

## 8. THE ANTIGRAVITY IDE PROMPT (copy everything below into Antigravity)

```
You are acting as a senior full-stack engineer (30+ years experience) and product architect.
Build "REOL Nexus" — a mobile-first, multi-business operations and financial command center
for REOL GLOBAL SOLUTIONS LIMITED, a Nigerian company operating multiple business units inside
one property: an Event Center, an Eatery, and a Laundry service (with the schema designed so
additional business units, e.g. car wash or shortlet rooms, can be added later via configuration,
not code changes).

GOAL: Give the business owner one daily, trustworthy answer — "did we make money today, across
everything, and where did it leak?" — while letting each business unit's manager record their own
operational and financial data in a scoped, secure way.

=== TECH STACK (use exactly this unless you identify a clearly superior, justified alternative) ===
- Framework: Next.js 14+ (App Router), TypeScript strict mode, mobile-first responsive layout, configured as an installable PWA.
- Backend & DB: Supabase (Postgres, Auth, Row Level Security, Storage, Realtime, Edge Functions, pg_cron for scheduled jobs).
- UI: Tailwind CSS + shadcn/ui components; clean, modern, "award-winning" fintech-dashboard aesthetic — generous whitespace, confident typography, a calm but premium color palette (avoid generic SaaS-blue cliché; consider a deep green/charcoal/gold palette evoking trust and money).
- Data fetching/state: TanStack Query + Supabase JS client; React Hook Form + Zod for all forms.
- Charts: Recharts or Tremor for KPI cards, trend lines, category breakdowns.
- Notifications: Web Push (service worker) for MVP daily digest; architect the notification service so it can later add Expo push without rewriting the trigger logic.
- Exports: CSV (native), PDF (@react-pdf/renderer), Excel (exceljs) — all branded with the org's logo and color.
- Repo structure: Turborepo monorepo — apps/web (this Next.js app now), reserve apps/mobile and packages/shared for a future Expo app; packages/database for Supabase types/migrations; packages/ui for shared design system components.
- Repo name: reol-nexus

=== DATA MODEL ===
Design and implement (via Supabase migrations) a normalized Postgres schema with these entities
and relationships, with RLS policies enforced at the database level (not just UI-level checks):
organizations; business_units (typed: event_center, eatery, laundry, custom — configurable, not
hardcoded enums baked into application logic); users/profiles linked to Supabase auth; roles and
permissions with a many-to-many role_permissions and user_roles table where a role assignment can
be scoped to a specific business_unit_id or be org-wide; a single unified `transactions` ledger
(income/expense, category, subcategory, amount, business_unit_id, recorded_by, source/source_ref)
that is the single source of truth for every financial figure in the system, regardless of which
module (booking, sale, order) generated it; categories/subcategories (org-wide or per-unit);
budgets and budget_line_items per business unit with variance tracking; module-specific operational
tables — event_bookings (client, date, hall, package, deposit, status), eatery_daily_sales
(simple sales entry), laundry_orders (customer, items, status pipeline, charge) — each of which,
on a defined trigger (e.g., booking marked "completed and paid", laundry order marked "collected
and paid"), automatically creates the corresponding row in the unified `transactions` ledger via a
Postgres trigger or Edge Function, so managers never have to double-enter data; daily_summaries as
a materialized/cached rollup per business unit per day for fast dashboard loads; audit_logs
capturing every create/update/delete on financial data with actor, timestamp, and before/after
diff; notification_preferences and device_tokens (the latter to be ready for Expo push later).

Write RLS policies such that: Admins/Owners see everything in their organization; a Unit Manager
can only read/write rows where business_unit_id matches a business unit they're assigned to via
user_roles, UNLESS their role includes a "view_all_units" permission; Finance Viewer roles can
read but never write financial data; all policies should be testable and documented.

=== ROLES & PERMISSIONS (seed these) ===
System roles: Owner/Admin (full access), Unit Manager (scoped to their business unit(s),
can record income/expense/bookings/orders, view their own unit's reports/budgets), Finance Viewer
(read-only across permitted units), Report Generator (can view + export but not edit), Staff
(Phase 2 — minimal data entry only, no financial visibility).
Granular permissions to seed: view_financial_data, manage_financial_data, export_reports,
manage_users, manage_business_units, set_budgets, approve_expenses, view_all_units.

=== CORE FEATURES TO BUILD (in this order) ===
1. Auth: email/password + Google OAuth via Supabase Auth; onboarding flow that creates the
   organization (REOL GLOBAL SOLUTIONS LIMITED), seeds the three initial business units
   (Event Center, Eatery, Laundry), and creates the first Admin/Owner user.
2. Admin console: CRUD for business units, categories/subcategories, users, roles, and
   role-permission assignments; a settings page for organization branding (logo upload to
   Supabase Storage, primary color) used later in exports and notifications.
3. Daily financial entry: a fast, mobile-friendly form per business unit for logging income
   and expense transactions with category/subcategory, optional receipt photo upload, and
   validation (Zod) that prevents negative/garbage amounts.
4. Owner Dashboard (the centerpiece screen): today's org-wide totals (income, expense, net
   profit), a per-business-unit breakdown grid/cards, percentage change vs. previous day,
   key KPIs (profit margin, ROI), and a prominent "all units at a glance" view designed to be
   read in under 10 seconds on a phone.
5. Historical & trend view: custom date-range picker, line/bar charts with zoom and tooltips,
   filterable by business unit and category, year-over-year/seasonal comparison view.
6. Budgets: create a budget per business unit with category-level line items; real-time
   actual-vs-budget comparison with absolute and percentage variance; automatic in-app +
   push alert when a unit crosses 80% of its budget or shows a significant negative variance;
   support mid-cycle budget revisions with a visible revision history.
7. Event Center module: bookings table/calendar (client, date, hall, package, deposit, status
   pipeline: inquiry → confirmed → completed/cancelled); marking a booking "completed and paid"
   auto-posts to the unified ledger.
8. Eatery module: simple daily sales entry (or itemized if time allows) that posts to the ledger.
9. Laundry module: orders with a status pipeline (received → in progress → ready → collected);
   marking "collected and paid" auto-posts to the ledger.
10. Notifications: a Supabase Edge Function on a cron schedule that, per organization, computes
    the daily summary and sends a Web Push notification (and optionally email via Resend) to
    users based on their notification_preferences (configurable delivery time and frequency);
    tapping the notification deep-links into the relevant dashboard view.
11. Exports: CSV, branded PDF, and Excel export of any report view (daily/weekly/monthly/custom
    range), filterable by business unit and category, including the org's logo/branding.
12. Audit log viewer (Admin only): searchable, filterable log of every financial data mutation.
13. Full audit-friendly logging server-side for every write to the `transactions` table.

=== NON-FUNCTIONAL REQUIREMENTS ===
- Mobile-first responsive design at every breakpoint; the app must be genuinely pleasant to use
  one-handed on a mid-range Android phone, since that's how the Unit Managers will use it daily.
- Installable as a PWA (manifest, service worker, offline-friendly shell) as a stand-in for a
  native app until the Expo build exists.
- Performance: dashboard initial load under ~1.5s on 4G; use Supabase's daily_summaries cache
  table rather than aggregating raw transactions on every dashboard load.
- Security: RLS on every table, encrypted-at-rest via Supabase defaults, sane password policy,
  optional MFA for Admin/Owner accounts, no financial data ever exposed via an unauthenticated
  route, signed/expiring URLs for any exported file links.
- Compliance: design data retention and consent handling with Nigeria's NDPR (Nigeria Data
  Protection Act/Regulation) in mind, not just GDPR boilerplate.
- Code quality: TypeScript strict, ESLint + Prettier configured, meaningful component/file
  structure (feature-based folders, not just "components" dumping ground), unit tests for
  ledger-posting logic and RLS-sensitive queries, and a README documenting setup, environment
  variables, and the database schema with an ERD.
- Architect every module (event_bookings, eatery_daily_sales, laundry_orders) behind a consistent
  internal interface so a future 4th business unit can be added primarily through configuration
  and a new "module" folder, not a rewrite of shared dashboard/ledger/notification logic.

=== DESIGN DIRECTION ===
This must feel like premium, trustworthy fintech software, not a generic admin template.
Use a confident, restrained color palette (suggest deep forest green or charcoal as primary,
warm gold/amber as an accent for highlights like profit figures, clean off-white background),
strong but simple typography hierarchy, card-based KPI summaries with subtle elevation/shadow,
and micro-interactions (smooth number count-ups for totals, gentle transitions on date range
changes) that make checking the daily numbers feel satisfying rather than like a chore.

=== DELIVERABLE FOR THIS SESSION ===
Scaffold the Turborepo monorepo (apps/web, packages/database, packages/ui, packages/config),
initialize the Next.js app with the stack above, write the full Supabase schema as versioned
SQL migrations with RLS policies, seed the organization/business units/roles/permissions for
REOL GLOBAL SOLUTIONS LIMITED, and build out Auth + the Owner Dashboard + the daily financial
entry form end-to-end and working, before moving on to budgets, modules, exports, and
notifications in that priority order. Confirm the architecture and schema with me before writing
application code, then proceed feature-by-feature.
```

---

## 9. A Few Things I'd Push Back On From the Original Brief (and why)

- **Firebase → Supabase:** Financial reporting lives and dies on relational queries (sum by category, group by date range, join bookings to ledger entries). Firestore makes you either denormalize aggressively or do this client-side, which gets ugly and expensive fast. Postgres + RLS is the right tool for money.
- **"Daily profit report" as the only KPI:** A business owner running 3+ units needs *per-unit* visibility *and* a blended total — otherwise a great eatery day can mask a bleeding laundry unit. The dashboard must default to "unit cards + org total," not just one number.
- **Treat "event center" as one of several units, not the app's identity:** Naming the repo and product around "Event Planning Financial Tracker" would lock you into a name and mental model you'll outgrow within months, given what you've described about the building.
- **NDPR, not just GDPR:** Since REOL operates in Nigeria, Nigeria's Data Protection Act (NDPR/NDPA) is the actually-relevant compliance regime — worth a one-line correction to the client's expectations.

This positions REOL Nexus to start as a focused MVP delivering exactly what's needed for the event center + two other units, while the underlying architecture is already shaped to absorb whatever REOL adds to that building next.
