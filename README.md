<div align="center">

<img src="apps/web/public/favicon.png" alt="REOL Nexus Logo" width="72" height="72" />

# REOL Nexus

**The unified digital platform for REOL Global Solutions Limited.**

A production-grade, full-stack monorepo housing both the public marketing storefront and the private financial operations dashboard for REOL's three business units: **Event Center**, **Eatery**, and **Laundry**.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://reol-global.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.10.1-EF4444?style=flat-square&logo=turborepo)](https://turbo.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[**Live Site →**](https://reol-global.vercel.app) · [**Dashboard →**](https://reol-global.vercel.app/dashboard) · [**Architecture →**](ARCHITECTURE.md)

</div>

---

## Table of Contents

1. [Overview](#1-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [Monorepo Structure](#4-monorepo-structure)
5. [Getting Started](#5-getting-started)
6. [Environment Variables](#6-environment-variables)
7. [Database Setup](#7-database-setup)
8. [Development Workflow](#8-development-workflow)
9. [Deployment](#9-deployment)
10. [Authentication & Roles](#10-authentication--roles)
11. [Available Scripts](#11-available-scripts)
12. [Project Roadmap](#12-project-roadmap)
13. [License](#13-license)

---

## 1. Overview

**REOL Nexus** is the complete digital backbone of REOL Global Solutions Limited — a premium multi-service establishment on Admiralty Way, Lekki Phase 1, Lagos. The platform serves two distinct audiences from a single Next.js application using route groups:

| Face | Route | Description |
|---|---|---|
| **Public Marketing Site** | `/` `/event-center` `/eatery` `/laundry` `/about` `/contact` `/coming-soon` | A stunning storefront where visitors explore services, view pricing, and submit enquiries — all of which land directly in the operations dashboard as tracked leads. |
| **Private Operations Dashboard** | `/dashboard` `/dashboard/entry` `/dashboard/budgets` `/dashboard/leads` `/dashboard/reports` | A role-restricted financial management console where the Owner/Admin and authorized team members record transactions, track KPIs, manage budgets, and review leads in real-time. |

The platform uses **one database** (Supabase Postgres), **one codebase** (this monorepo), and **one deployment** (Vercel) — no content duplication, no sync drift.

---

## 2. Features

### Public Storefront
- 🏛️ **Event Center page** — Gold/Silver/Platinum event package listings, Terms & Conditions, gallery, and an inline booking enquiry form
- 🍽️ **Eatery page** — Full dynamic menu with categories (Mains, Starters, Drinks, Specials), dietary tags, and a food order form
- 👕 **Laundry page** — Service listings, pricing tiers, active deals/promotions, and a scheduled pickup request form
- 🌟 **Coming Soon page** — Announced upcoming business units (Shortlet Suites, Auto Spa, Mini-Mart) with notify-me forms
- 📬 **Lead-to-Dashboard pipeline** — Every public form submission (`public_enquiries`) appears instantly in the private `/dashboard/leads` view
- ✅ **Toast notifications** — Every interactive element provides responsive feedback across all devices
- 📱 **WhatsApp floating button** — One-click WhatsApp chat link available on all public pages
- 🔍 **Full SEO** — Per-page title tags, meta descriptions, Open Graph, semantic HTML, and accessible alt text

### Operations Dashboard
- 📊 **Financial Overview** — Revenue and expense KPI cards, a recharts-powered 7-day trend chart, and a live transaction ledger
- 📝 **Data Entry Module** — Unified entry form for Eatery sales, Event bookings, Laundry orders, and General transactions
- 💰 **Budget Manager** — Set and track operational budgets per business unit with line-item control
- 📋 **Leads Manager** — Full leads table with status tracking (New → Contacted → Converted → Closed) sourced from public enquiry forms
- 📈 **Reports Viewer** — Export-ready financial reports filtered by date range, business unit, and transaction type
- 🔐 **Role-Based Access Control** — Five system roles (Owner/Admin, Unit Manager, Finance Viewer, Report Generator, Staff) with granular permission scoping per business unit

---

## 3. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.2.0 |
| **Language** | TypeScript | 5.9.2 |
| **UI Library** | React | 19.2.0 |
| **Styling** | TailwindCSS + PostCSS | 4.3.2 |
| **Icons** | Lucide React | 1.22.0 |
| **Forms** | React Hook Form + Zod | 7.80.0 / 4.4.3 |
| **Charts** | Recharts | 3.9.0 |
| **Database** | Supabase (PostgreSQL) | 2.108.2 |
| **Auth** | Supabase Auth (SSR) | 0.12.0 |
| **Build System** | Turborepo | 2.10.1 |
| **Package Manager** | pnpm | 9.0.0 |
| **Deployment** | Vercel | — |

---

## 4. Monorepo Structure

```
reol-nexus/
├── apps/
│   ├── web/                              # Primary Next.js application (port 3000)
│   │   ├── app/
│   │   │   ├── (marketing)/             # Route group: public storefront (no auth)
│   │   │   │   ├── layout.tsx           # Shared Header + Footer + WhatsApp button
│   │   │   │   ├── page.tsx             # Homepage (Hero, Services, Testimonials, CTA)
│   │   │   │   ├── event-center/        # Event packages, gallery, booking enquiry form
│   │   │   │   ├── eatery/              # Menu, dietary tags, order form
│   │   │   │   ├── laundry/             # Service listings, deals, pickup form
│   │   │   │   ├── coming-soon/         # Upcoming units, notify-me form
│   │   │   │   ├── about/               # Brand story and team
│   │   │   │   └── contact/             # General contact form
│   │   │   ├── dashboard/               # Route group: private financial console
│   │   │   │   ├── layout.tsx           # Sidebar, mobile nav, auth guard, org loader
│   │   │   │   ├── page.tsx             # KPI overview, trend chart, recent transactions
│   │   │   │   ├── entry/               # Unified data entry form (all 3 business units)
│   │   │   │   ├── budgets/             # Budget planning and line-item tracking
│   │   │   │   ├── leads/               # Public enquiry leads management table
│   │   │   │   └── reports/             # Financial reports and data export viewer
│   │   │   ├── auth/
│   │   │   │   ├── actions.ts           # Server actions: login, signup, logout, onboarding
│   │   │   │   ├── login/               # Login page
│   │   │   │   └── signup/              # Signup page
│   │   │   ├── onboarding/              # First-time org setup (runs initialize_new_organization RPC)
│   │   │   ├── icon.tsx                 # Dynamic brand favicon (generated at runtime)
│   │   │   ├── apple-icon.tsx           # Apple touch icon
│   │   │   ├── layout.tsx               # Root layout + Toast provider
│   │   │   └── globals.css              # Global CSS resets and custom fonts
│   │   ├── components/
│   │   │   ├── marketing/
│   │   │   │   ├── Header.tsx           # Top navigation bar (mobile-responsive)
│   │   │   │   ├── Footer.tsx           # Full footer with operating hours, links, socials
│   │   │   │   ├── WhatsAppButton.tsx   # Floating WhatsApp chat button
│   │   │   │   ├── ContactForm.tsx      # General contact form (writes to public_enquiries)
│   │   │   │   ├── EventEnquiryForm.tsx # Event booking enquiry form
│   │   │   │   ├── EateryOrderForm.tsx  # Eatery food order form
│   │   │   │   ├── LaundryPickupForm.tsx# Laundry pickup request form
│   │   │   │   └── NotifyMeForm.tsx     # Notify-me form for coming soon units
│   │   │   ├── dashboard/
│   │   │   │   ├── EntryForm.tsx        # Unified transaction & booking data entry
│   │   │   │   ├── BudgetForm.tsx       # Budget creation and line-item form
│   │   │   │   ├── LeadsTable.tsx       # Sortable leads management table
│   │   │   │   ├── ReportsViewer.tsx    # Financial report viewer with filters
│   │   │   │   └── TrendChart.tsx       # Recharts 7-day revenue/expense trend chart
│   │   │   └── ui/
│   │   │       └── Toast.tsx            # Global toast notification system + provider
│   │   ├── lib/
│   │   │   └── supabase/
│   │   │       ├── client.ts            # Browser-side Supabase client
│   │   │       ├── server.ts            # Server-side Supabase client (with mock fallback)
│   │   │       ├── middleware.ts        # Session refresh utility for Next.js middleware
│   │   │       └── mockClient.ts        # Stateful mock client with rich seed data (dev/fallback)
│   │   ├── middleware.ts                # Route session guard (Supabase SSR cookie refresh)
│   │   ├── next.config.js
│   │   ├── tailwind.config.cjs
│   │   └── package.json
│   └── docs/                            # Internal documentation portal (port 3001)
├── packages/
│   ├── database/
│   │   └── supabase/
│   │       ├── migrations/
│   │       │   ├── 20260630000000_initial_schema.sql    # Core schema: 20 tables, RLS, triggers, helper functions
│   │       │   └── 20260630000001_public_storefront.sql # Storefront tables: packages, menus, enquiries
│   │       ├── seed.sql                 # System permissions seed (8 granular permissions)
│   │       └── storefront_seed.sql      # Rich content seed: packages, menu items, laundry, testimonials
│   ├── ui/                              # Shared React component library
│   ├── eslint-config/                   # Shared ESLint configuration
│   └── typescript-config/              # Shared tsconfig bases
├── .env.example                         # Required environment variables template
├── .gitignore
├── ARCHITECTURE.md                      # System architecture and design decisions
├── MEMORY.md                            # Project memory and decision log
├── package.json                         # Workspace root
├── pnpm-workspace.yaml
└── turbo.json                           # Turborepo pipeline configuration
```

---

## 5. Getting Started

### Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| Node.js | 18.x | [nodejs.org](https://nodejs.org) |
| pnpm | 9.0.0 | `npm install -g pnpm@9` |
| Git | any | [git-scm.com](https://git-scm.com) |

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/Ebendttl/reol-nexus.git
cd reol-nexus

# Install all workspace dependencies
pnpm install
```

---

## 6. Environment Variables

The web app requires two environment variables from your Supabase project. Copy the example file and fill in your values:

```bash
cp .env.example apps/web/.env.local
```

Then edit `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> **Where to find these values:**
> 1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
> 2. Navigate to your project → **Settings** → **API**
> 3. Copy the **Project URL** and the **`anon` / `public`** key

> **Without these variables**, the app will automatically run in **mock mode** using rich seed data defined in `mockClient.ts`. This is intentional and safe for local development without a Supabase account.

---

## 7. Database Setup

All SQL is version-controlled in `packages/database/supabase/migrations/`. Apply them in order using the **Supabase SQL Editor** (Dashboard → SQL Editor → New Query):

### Step 1 — Core Schema
Copy and run: `packages/database/supabase/migrations/20260630000000_initial_schema.sql`

This creates all 20 tables, Row-Level Security policies, database triggers (ledger sync, audit logging, daily summaries), helper functions (`has_permission`, `get_user_org_id`), and the atomic onboarding RPC (`initialize_new_organization`).

### Step 2 — Public Storefront Schema
Copy and run: `packages/database/supabase/migrations/20260630000001_public_storefront.sql`

This creates the 10 storefront tables (`event_packages`, `menu_items`, `laundry_services`, `testimonials`, `gallery_images`, `coming_soon_units`, `public_enquiries`, etc.) and their public/private RLS policies.

### Step 3 — System Permissions Seed
Copy and run: `packages/database/supabase/seed.sql`

This seeds the 8 granular system permission codes required by the RBAC system.

### Step 4 — Complete Onboarding
Visit your deployed application at `/signup`, create your owner account, and complete the **Onboarding** form. This triggers the `initialize_new_organization` Postgres RPC which atomically creates the organization, links 3 default business units (Event Center, Eatery, Laundry), assigns the Owner/Admin role with full permissions, and seeds default financial categories.

### Step 5 — Storefront Content Seed *(Optional but Recommended)*
After completing Step 4, copy and run: `packages/database/supabase/storefront_seed.sql`

This seeds rich placeholder data into all public storefront tables (event packages with inclusions, 6 menu items, 4 laundry services, deals, testimonials, gallery images, and 3 coming soon units) so the public site renders compelling content immediately.

---

## 8. Development Workflow

### Start All Apps

```bash
# From workspace root — starts both web (port 3000) and docs (port 3001) concurrently
npm run dev
```

### Start Only the Web App

```bash
pnpm --filter web dev
```

### Type Checking

```bash
npm run check-types
```

### Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

### Adding New Database Tables

> **⚠️ Never edit existing migration files.** Always create a new numbered migration file.

```bash
# Create a new migration (increment the timestamp)
touch packages/database/supabase/migrations/20260630000002_your_feature_name.sql
```

---

## 9. Deployment

### Vercel (Recommended)

1. Push this repository to GitHub.
2. Import the project in your [Vercel dashboard](https://vercel.com/new).
3. Configure the project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/web`
   - *(Optional: enable Vercel to manage build cache for Turborepo)*
4. Add **Environment Variables** in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your Supabase anon key
5. Click **Deploy**.

**Build commands** Vercel uses automatically:
```
Build Command:  pnpm build  (or turbo run build from root)
Install Command: pnpm install
Output Directory: .next
```

### DNS / Custom Domain

In Vercel Project → **Domains**, add your custom domain (e.g., `reol-global.com`) and follow the DNS record instructions provided.

---

## 10. Authentication & Roles

REOL Nexus uses **Supabase Auth** with server-side session management via `@supabase/ssr`.

### User Flow

```
/signup → Email Verification → /onboarding (org setup) → /dashboard
/login  → Supabase Session Cookie → /dashboard
```

### System Roles

| Role | Scope | Key Permissions |
|---|---|---|
| **Owner/Admin** | Organization-wide | All 8 permissions (full access) |
| **Unit Manager** | Per business unit | View, Manage, Export, Set Budgets |
| **Finance Viewer** | Organization-wide | View financial data, view all units |
| **Report Generator** | Organization-wide | View data, export reports |
| **Staff** | Per business unit | Limited operational access |

### Granular Permissions

| Permission Code | Description |
|---|---|
| `view_financial_data` | View financial totals, dashboard, and transaction logs |
| `manage_financial_data` | Record and update all transaction types |
| `export_reports` | Export data to CSV/PDF/Excel |
| `manage_users` | Invite team members, assign roles |
| `manage_business_units` | Add/edit/delete business units and branding |
| `set_budgets` | Set and close budgets and line items |
| `approve_expenses` | Approve expenses exceeding budget thresholds |
| `view_all_units` | Bypass unit-level scoping to see all units' data |

All permissions are enforced at the **PostgreSQL RLS layer** via the `has_permission(perm_code, business_unit_id)` helper function — not just at the UI level.

---

## 11. Available Scripts

Run all scripts from the workspace root:

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in development mode (hot reload) |
| `npm run build` | Build all apps for production |
| `npm run lint` | Run ESLint across all workspaces |
| `npm run check-types` | Run TypeScript type checking across all workspaces |
| `npm run format` | Format all `.ts`, `.tsx`, `.md` files with Prettier |

---

## 12. Project Roadmap

| Phase | Feature | Status |
|---|---|---|
| ✅ | Core monorepo setup (Turborepo + pnpm + TypeScript) | **Done** |
| ✅ | Database schema — 20+ tables, RLS, triggers | **Done** |
| ✅ | Auth flow — signup, login, onboarding, logout | **Done** |
| ✅ | Public marketing site — all 6 pages live | **Done** |
| ✅ | Operations dashboard — KPI overview, entry, budgets, leads, reports | **Done** |
| ✅ | Toast notification system (every button/icon provides feedback) | **Done** |
| ✅ | Favicon and Apple icon (dynamic, brand-colored) | **Done** |
| ✅ | Vercel production deployment | **Done** |
| ✅ | WhatsApp floating button with correct contact number | **Done** |
| 🔄 | Admin CMS — in-dashboard content editing for public storefront tables | *Planned* |
| 🔄 | Team member invitation and user management UI | *Planned* |
| 🔄 | Mobile app (Expo/React Native) using same Supabase backend | *Planned* |
| 🔄 | PDF invoice and report generation | *Planned* |
| 🔄 | Email notifications via Supabase Edge Functions | *Planned* |
| 🔄 | Shortlet Suites business unit (Q3 2026) | *Planned* |
| 🔄 | Auto Spa & Detailers business unit (Q4 2026) | *Planned* |

---

## 13. License

Copyright © 2026 **Ebenezer Akinseinde**. Licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ for **REOL Global Solutions Limited** · Lekki Phase 1, Lagos, Nigeria

</div>
