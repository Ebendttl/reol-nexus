# REOL Nexus — Project Memory & Decision Log

> **Purpose of this file:** This is the authoritative source of truth for all architectural decisions, implementation history, known constraints, and future plans for the REOL Nexus platform. It exists to prevent hallucination in future AI sessions and to give any developer (human or AI) full situational awareness before touching any part of the codebase.
>
> **How to use:** Read this file completely before making any code change, adding any new feature, or proposing any database modification. Update this file when any significant decision is made.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | REOL Nexus |
| **Client / Owner** | REOL Global Solutions Limited |
| **Owner Name** | Ebenezer Akinseinde |
| **Business Address** | Plot 12, REOL Plaza, Admiralty Way, Lekki Phase 1, Lagos, Nigeria |
| **Contact Phone** | +234 813 731 0107 |
| **Contact Email** | info@reolglobal.com |
| **Live URL** | https://reol-global.vercel.app |
| **GitHub Repo** | Ebendttl/reol-nexus |
| **License** | MIT (Ebenezer Akinseinde, 2026) |
| **Started** | June 2026 |
| **Current Stage** | Production (v0.1.0) |

---

## 2. The Three Business Units

These are fixed. Do not add, rename, or change their slugs without coordinating a database migration:

| Unit | Slug | DB Type | Icon | Color |
|---|---|---|---|---|
| **Event Center** | `event-center` | `event_center` | `calendar` | `#D4AF37` (Gold) |
| **Eatery** | `eatery` | `eatery` | `utensils` | `#FF5733` (Orange-Red) |
| **Laundry** | `laundry` | `laundry` | `shirt` | `#33B5E5` (Sky Blue) |

These three units are **automatically seeded** when the Owner calls `initialize_new_organization()` during onboarding. They are never manually inserted.

---

## 3. Full Tech Stack (Pinned Versions)

| Technology | Role | Version |
|---|---|---|
| Next.js | Framework (App Router) | **16.2.0** — Do not upgrade without testing SSR/middleware |
| React | UI Library | **19.2.0** |
| TypeScript | Language | **5.9.2** |
| TailwindCSS | Styling | **4.3.2** (uses PostCSS via `@tailwindcss/postcss`) |
| Supabase JS | Database + Auth | **2.108.2** |
| Supabase SSR | Cookie session management | **0.12.0** |
| React Hook Form | Forms | **7.80.0** |
| Zod | Validation schemas | **4.4.3** |
| Recharts | Data visualization | **3.9.0** |
| Lucide React | Icons | **1.22.0** |
| Turborepo | Build system | **2.10.1** |
| pnpm | Package manager | **9.0.0** |
| Node.js | Runtime | **≥ 18** |

---

## 4. Database Architecture (Critical — Read Before Any DB Change)

### 4a. Migration Files (Do Not Edit Existing)

| File | Tables Created | Notes |
|---|---|---|
| `20260630000000_initial_schema.sql` | 20 core tables | ALL triggers, RLS policies, helper functions, `initialize_new_organization` RPC |
| `20260630000001_public_storefront.sql` | 10 storefront tables | Public enquiries, event packages, menus, laundry services, testimonials, gallery, coming soon |

**Rule:** Never edit existing migration files. Always create a new numbered migration.

### 4b. Helper Functions

| Function | Signature | Purpose |
|---|---|---|
| `get_user_org_id(u_id)` | `RETURNS uuid` | Safely retrieves calling user's org ID without RLS recursion |
| `has_permission(perm_code, bu_id?)` | `RETURNS boolean` | Granular RBAC check at the DB layer |
| `initialize_new_organization(...)` | `RETURNS uuid` | Atomic org creation: org + business units + roles + permissions + categories |
| `refresh_daily_summary(bu_id, date)` | `RETURNS void` | Recomputes `daily_summaries` cache table |
| `handle_new_user()` | `RETURNS trigger` | Fires on `auth.users INSERT`, creates profile row |

### 4c. Trigger Chain (Critical — Do Not Modify Without Full Understanding)

```
INSERT/UPDATE event_bookings → trg_sync_booking_to_ledger → sync_booking_to_ledger()
                             → Upserts into public.transactions

INSERT/UPDATE laundry_orders → trg_sync_laundry_to_ledger → sync_laundry_to_ledger()
                             → Upserts into public.transactions

INSERT/UPDATE eatery_daily_sales → trg_sync_eatery_to_ledger → sync_eatery_to_ledger()
                                 → Upserts into public.transactions

DELETE on event_bookings/laundry_orders/eatery_daily_sales
  → trg_delete_*_from_ledger → delete_from_ledger_on_source_delete()
  → Deletes corresponding public.transactions row

INSERT/UPDATE/DELETE public.transactions
  → trg_refresh_daily_summary → trigger_refresh_daily_summary()
  → Calls refresh_daily_summary() for the relevant date and business unit

INSERT/UPDATE/DELETE public.transactions
  → trg_log_transaction_mutation → log_transaction_mutation()
  → Appends to public.audit_logs

INSERT auth.users → on_auth_user_created → handle_new_user()
  → Creates corresponding public.profiles row
```

### 4d. RLS Summary

- **Public read access** is granted on: `public_services`, `event_packages`, `event_terms`, `menu_items`, `laundry_services`, `deals_promotions`, `testimonials`, `gallery_images`, `coming_soon_units`
- **Public insert** is allowed on: `public_enquiries` only (no auth required — this is the leads capture mechanism)
- **All financial tables** (transactions, budgets, event_bookings, laundry_orders, eatery_daily_sales) are restricted by `has_permission()` + org scoping
- **All tables** have RLS **enabled**

### 4e. Seed Files (Run Once Per Supabase Project)

| File | What it Seeds | When to Run |
|---|---|---|
| `seed.sql` | 8 system permission codes | Before onboarding |
| `storefront_seed.sql` | Event packages, menu items, laundry services, deals, testimonials, gallery images, coming soon units | After completing onboarding (business unit IDs must exist) |

---

## 5. Application Architecture

### 5a. Route Structure

```
/ (public — no auth required)
├── /                    Homepage (hero, services overview, testimonials, CTA)
├── /event-center        Event packages and enquiry form
├── /event-center/[slug] Individual event package detail
├── /eatery              Full menu with categories
├── /laundry             Laundry services, deals, pickup form
├── /coming-soon         Upcoming units, notify-me form
├── /about               Brand story
└── /contact             General contact form

/auth
├── /login               Login form (Supabase email/password)
└── /signup              Signup form (creates auth user → redirects to /onboarding)

/onboarding              Org setup form (runs initialize_new_organization RPC)

/dashboard (private — requires active session + org_id on profile)
├── /dashboard           KPI overview, trend chart, recent transactions
├── /dashboard/entry     Unified data entry form
├── /dashboard/budgets   Budget planning
├── /dashboard/leads     Public enquiry leads table
└── /dashboard/reports   Financial reports viewer
```

### 5b. Supabase Client Strategy

| Context | Client Used | File |
|---|---|---|
| Server Components / API | `createClient()` | `lib/supabase/server.ts` |
| Browser / Client Components | `createBrowserClient()` | `lib/supabase/client.ts` |
| Middleware (session refresh) | `updateSession()` | `lib/supabase/middleware.ts` |
| Missing env vars (dev/local fallback) | `createMockClient()` | `lib/supabase/mockClient.ts` |

**Mock Mode:** When `NEXT_PUBLIC_SUPABASE_URL` is absent or equals `dummy-project-id`, all clients automatically fall back to `mockClient.ts`. This contains a full in-memory dataset and never requires a live Supabase connection.

### 5c. Auth Flow

```
signup → supabase.auth.signUp() → handle_new_user() trigger creates profiles row
       → redirect('/onboarding')

onboarding → onboardingAction() server action
           → supabase.rpc('initialize_new_organization', {...})
           → redirect('/dashboard')

Every route request → middleware.ts → updateSession() → refreshes Supabase cookie session

dashboard layout.tsx → server-side auth.getUser() check
                     → if no user: redirect('/login')
                     → if no profile.org_id: redirect('/onboarding')
```

---

## 6. Contact & Phone Numbers (Confirmed Correct as of June 30, 2026)

| Use | Number |
|---|---|
| **Primary contact phone** | +234 813 731 0107 |
| **WhatsApp** | +234 813 731 0107 (same) |
| **`tel:` href format** | `tel:+2348137310107` |
| **WhatsApp URL format** | `https://wa.me/2348137310107` |

> **History:** The number was originally set to `+234 812 345 6789` (placeholder/incorrect). It was corrected to `+234 813 731 0107` on **June 30, 2026** across all 6 files: Footer.tsx, WhatsAppButton.tsx, page.tsx (homepage), event-center/page.tsx, eatery/page.tsx, laundry/page.tsx.

---

## 7. Design System Tokens

These are the established brand colors and design decisions. Do not deviate from these without explicit instruction:

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| **Primary Green** | `#0F5132` | `#0F5132` | CTAs, active states, brand identity |
| **Emerald Accent** | — | `#38C186` | Dark mode icon/text highlight |
| **Gold Accent** | `#D4AF37` | `#D4AF37` | Hero text, Event Center highlight |
| **Background** | `#F4F7F5` | `#0A0D0B` | Page background |
| **Surface** | `#FFFFFF` | `#111612` | Cards, sidebar, modals |
| **Surface Alt** | `#F4F7F5` | `#151B16` | Table rows, secondary sections |
| **Border** | `#E2EAE4` | `#1E2720` | All borders and dividers |
| **Text Primary** | `#17221A` | `#E2EAE4` | Body text, headings |
| **Text Secondary** | `#5C6E62` | `#90A496` | Captions, placeholders, labels |
| **Font** | System Sans / Geist | — | `font-sans` |
| **Border Radius** | `rounded-lg` (0.5rem) | — | Default for all cards/inputs |

---

## 8. Implementation History (Chronological)

| Date | Change | Notes |
|---|---|---|
| Jun 30, 2026 | Initial monorepo scaffolded with Turborepo, pnpm, Next.js | Root workspace + web + docs + packages |
| Jun 30, 2026 | Core database schema written (`20260630000000_initial_schema.sql`) | 20 tables, RLS, triggers, RBAC |
| Jun 30, 2026 | Public storefront schema written (`20260630000001_public_storefront.sql`) | 10 tables, public_enquiries lead pipeline |
| Jun 30, 2026 | Auth flow implemented (signup → onboarding → dashboard) | Server actions in `app/auth/actions.ts` |
| Jun 30, 2026 | All 6 public marketing pages built | Homepage, Event Center (with [slug]), Eatery, Laundry, About, Contact, Coming Soon |
| Jun 30, 2026 | All 5 dashboard pages built | Overview, Entry, Budgets, Leads, Reports |
| Jun 30, 2026 | Mock client written with full seed data | Enables dev without Supabase credentials |
| Jun 30, 2026 | Toast notification system added globally | `Toast.tsx` wraps all pages, every non-functional button shows "coming soon" toast |
| Jun 30, 2026 | Toast mobile overflow fixed | Changed from `right-6 w-full` to `left-4 right-4` on mobile, `md:left-auto md:right-6` on desktop |
| Jun 30, 2026 | Custom favicon generated | Dynamic SVG icon via `app/icon.tsx` and `app/apple-icon.tsx` |
| Jun 30, 2026 | Deployed to Vercel | Live at https://reol-global.vercel.app |
| Jun 30, 2026 | Supabase project created and connected | All 3 SQL migration + seed scripts run successfully |
| Jun 30, 2026 | Phone number corrected | Changed from `+234 812 345 6789` to `+234 813 731 0107` in 6 files + WhatsApp button |
| Jun 30, 2026 | `storefront_seed.sql` created | Rich placeholder data for all public storefront tables |
| Jun 30, 2026 | Bug fixed: `delete_from_ledger_on_source_delete` trigger | Was `LANGUAGE sql`, changed to `LANGUAGE plpgsql` (Postgres error `42P13`) |

---

## 9. Known Issues & Technical Debt

| Issue | Severity | Notes |
|---|---|---|
| Middleware deprecation warning | Low | Next.js 16 deprecates `middleware` convention in favour of `proxy`. Non-breaking; to be resolved in next framework upgrade. |
| Mock client manual sync | Medium | `mockClient.ts` must be manually kept in sync with SQL schema changes. If schema changes, update mock data shapes too. |
| Role scoping in UI | Medium | Dashboard currently shows all data to any authenticated user. UI-level role checking (disabling certain nav items or form fields based on `has_permission`) is not yet implemented — only database-level RLS is enforced. |
| Social media links | Low | Instagram, Facebook, Twitter links in Footer.tsx are `#` placeholders. Will show "coming soon" toast until real URLs are set. |
| Owner Dashboard link | Low | Footer's "Owner Dashboard" link is placeholder. Currently toasts "coming soon". |

---

## 10. Future Features (Planned — Do Not Build Without Discussion)

### Phase 2 (Near-Term)
- **Admin CMS**: In-dashboard UI to update event packages, menu items, laundry services, deals, testimonials, and gallery images without touching code or SQL.
- **User Management**: Invite team members by email, assign roles, view role assignments.
- **PDF Reports**: Generate branded PDF invoices and financial summaries from the Reports Viewer.

### Phase 3 (Medium-Term)
- **Push Notifications**: Expo Push Notification support via `device_tokens` table (already in schema).
- **Email Notifications**: Supabase Edge Functions to email the owner when a new lead is submitted.
- **Shortlet Suites Unit**: New business unit with booking calendar — targeted Q3 2026.

### Phase 4 (Long-Term)
- **Mobile App**: React Native (Expo) app using the same Supabase backend for on-the-go financial recording.
- **Multi-Org Support**: Allow REOL to white-label the platform for other business groups.

---

## 11. Rules for Future AI Sessions

> These rules are non-negotiable. Any AI session working on this codebase must follow them:

1. **Read this file first.** Always read `MEMORY.md` before any code changes.
2. **Never change phone numbers** without explicit user confirmation. The correct number is `+234 813 731 0107`.
3. **Never edit existing migration files.** Create new numbered migrations only.
4. **Never remove the mock client.** `mockClient.ts` is required for offline dev.
5. **Never change Tailwind class design tokens** listed in Section 7 without user approval.
6. **Never rename or change business unit slugs** without a coordinated database migration.
7. **All trigger functions must use `LANGUAGE plpgsql`** — not `LANGUAGE sql` — because they use `OLD`/`NEW` row references and control flow.
8. **The Supabase client selection strategy is intentional.** Server components use `server.ts`, client components use `client.ts`, middleware uses `middleware.ts`. Do not consolidate.
9. **Toast notifications are mandatory** for every non-routable button/icon across the entire site. Never leave a clickable element that does nothing.
10. **Check ARCHITECTURE.md** for deeper system diagrams and tradeoff discussions.
