# Contributing to REOL Nexus

Thank you for your interest in contributing to REOL Nexus. This document outlines the development standards and workflow for this project.

> **Note:** This is a proprietary application for REOL Global Solutions Limited. External contributions require prior written approval from the project owner (Ebenezer Akinseinde).

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Development Setup](#development-setup)
3. [Branching Strategy](#branching-strategy)
4. [Commit Convention](#commit-convention)
5. [Code Style](#code-style)
6. [Database Migrations](#database-migrations)
7. [Pull Request Process](#pull-request-process)

---

## 1. Code of Conduct

- Be respectful and professional in all communications.
- Document your changes clearly.
- Do not commit credentials, `.env` files, or any secrets.

---

## 2. Development Setup

Follow the full setup guide in [README.md](README.md#5-getting-started).

Quick start:
```bash
git clone https://github.com/Ebendttl/reol-nexus.git
cd reol-nexus
pnpm install
cp .env.example apps/web/.env.local  # Fill in your Supabase keys
npm run dev
```

---

## 3. Branching Strategy

```
main          → Production branch. Direct pushes are blocked.
develop       → Integration branch. Feature branches merge here first.
feature/*     → Individual feature branches (e.g., feature/admin-cms)
fix/*         → Bug fix branches (e.g., fix/toast-mobile-overflow)
chore/*       → Non-functional work (e.g., chore/update-dependencies)
```

**Flow:**
```
feature/your-feature → develop → (reviewed & tested) → main
```

---

## 4. Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <description>

Types:
  feat     — A new feature
  fix      — A bug fix
  chore    — Non-functional changes (build, deps, config)
  docs     — Documentation updates only
  refactor — Code restructure without behavior change
  style    — Formatting, whitespace (no logic change)
  test     — Adding or updating tests

Examples:
  feat(dashboard): add PDF export for financial reports
  fix(toast): correct mobile left-side overflow on small viewports
  chore(deps): upgrade next.js to 16.3.0
  docs(readme): add database setup section
```

---

## 5. Code Style

- **TypeScript**: Strict mode enabled. All values must be typed.
- **React**: Use functional components with explicit return types.
- **Tailwind**: Use design tokens from `MEMORY.md §7`. No arbitrary hex colors outside the defined palette.
- **Forms**: Use React Hook Form + Zod for all user-facing forms.
- **Icons**: Use Lucide React only. Do not add Font Awesome or any other icon library.
- **Imports**: Use absolute imports (e.g., `../../lib/supabase/server`) — no barrel files.

Run linting before committing:
```bash
npm run lint
npm run check-types
```

---

## 6. Database Migrations

> **Critical Rule: Never edit existing migration files.**

To add or alter a database table:

1. Create a new file in `packages/database/supabase/migrations/`:
   ```bash
   # Format: YYYYMMDDHHMMSS_description.sql
   touch packages/database/supabase/migrations/20260701000000_add_invoice_table.sql
   ```

2. Write forward-only SQL (no `DOWN` migrations).
3. All new tables must have:
   - UUID primary key (`DEFAULT gen_random_uuid()`)
   - `created_at timestamptz NOT NULL DEFAULT now()`
   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
   - At minimum one RLS policy

4. Test in Supabase SQL Editor before committing.

---

## 7. Pull Request Process

1. Ensure `npm run lint` and `npm run check-types` pass with zero errors.
2. Write a clear PR description: what changed, why, and how to test it.
3. Reference any related issue numbers.
4. Request a review from the project owner.
5. Do not merge your own PRs.

---

For questions, contact the project owner via the REOL Nexus internal channels.
