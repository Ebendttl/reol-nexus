# Changelog

All notable changes to REOL Nexus are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org).

---

## [Unreleased]

### Planned
- Admin CMS for in-dashboard content editing of storefront tables
- Team member invitation and user management UI
- PDF report generation
- Email notifications via Supabase Edge Functions
- Push notification infrastructure (Expo-ready `device_tokens` table already in schema)

---

## [0.1.0] — 2026-06-30

### 🎉 Initial Production Release

#### Added
- **Monorepo architecture** — Turborepo v2.10.1 with pnpm v9.0.0 workspaces, two Next.js apps (`web` port 3000, `docs` port 3001), and four shared packages (`database`, `ui`, `eslint-config`, `typescript-config`)
- **Core database schema** — 20 PostgreSQL tables including organizations, business units, profiles, roles, permissions, role permissions, user roles, categories, subcategories, transactions, budgets, budget line items, event bookings, menu items, eatery daily sales, laundry orders, daily summaries, audit logs, notification preferences, and device tokens
- **Public storefront schema** — 10 additional tables: public services, event packages, event terms, extended menu items (with description, image, dietary tags), laundry services, deals & promotions, testimonials, gallery images, coming soon units, and public enquiries
- **Row-Level Security** — All 30 tables secured with RLS policies; `has_permission()` PLPGSQL helper enforces RBAC at the database layer
- **Ledger synchronization triggers** — Automatic upsert of event bookings, laundry orders, and eatery sales into the unified `transactions` ledger
- **Audit log trigger** — Automatic logging of all transaction INSERT/UPDATE/DELETE operations into `audit_logs`
- **Daily summary trigger** — Automatic recomputation of `daily_summaries` cache table on any ledger modification
- **`initialize_new_organization` RPC** — Atomic PostgreSQL function that creates an org, links 3 business units, seeds 5 roles with permissions, assigns Owner/Admin to the caller, and seeds 11 default financial categories in one transaction
- **Authentication flow** — Supabase Auth with email/password; signup → profile creation trigger → onboarding → dashboard; session managed via `@supabase/ssr` HTTP-only cookies
- **Public marketing site** — 6 fully rendered pages: Homepage (hero, services, testimonials, coming soon, CTA), Event Center (packages with inclusions, gallery, enquiry form), Eatery (full menu with dietary tags, order form), Laundry (services, deals, pickup form), Coming Soon (announced units, notify-me form), About, Contact
- **Operations dashboard** — 5 pages: Overview (KPI cards, 7-day recharts trend chart, recent transactions), Data Entry (unified form for all 3 business units and general expenses), Budgets, Leads (public enquiries table with status management), Reports
- **Mock client** — `lib/supabase/mockClient.ts` with rich in-memory seed data enabling full local development without Supabase credentials
- **Toast notification system** — Global `Toast.tsx` provider wrapping all pages; every non-functional button/icon shows a contextual "Coming Soon" or informational toast
- **WhatsApp floating button** — Available on all public pages; opens a WhatsApp chat to `+234 813 731 0107`
- **Dynamic favicon** — Brand-colored SVG favicon generated at runtime via `app/icon.tsx` and `app/apple-icon.tsx`
- **Full SEO** — Per-page `metadata` objects with title, description; semantic HTML throughout
- **Vercel deployment** — Live at https://reol-global.vercel.app with environment variables configured
- **storefront_seed.sql** — Rich placeholder seed script for all public storefront tables (3 event packages, 6 menu items, 4 laundry services, 2 deals, 3 testimonials, 4 gallery images, 3 coming soon units)

#### Fixed
- `delete_from_ledger_on_source_delete()` trigger function was incorrectly declared as `LANGUAGE sql` instead of `LANGUAGE plpgsql`, causing Postgres error `42P13` — corrected in migration file

#### Changed
- Contact phone number corrected from placeholder `+234 812 345 6789` to `+234 813 731 0107` across all 6 files

#### Infrastructure
- Toast container positioning fixed for mobile viewports (prevented left-side clipping by replacing `right-6 w-full` with `left-4 right-4` on mobile and `md:left-auto md:right-6` on desktop)

---

[Unreleased]: https://github.com/Ebendttl/reol-nexus/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Ebendttl/reol-nexus/releases/tag/v0.1.0
