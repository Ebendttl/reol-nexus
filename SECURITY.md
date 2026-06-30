# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.1.x (current) | ✅ Yes |

---

## Reporting a Vulnerability

If you discover a security vulnerability in REOL Nexus, **do not open a public GitHub issue.**

Please report it privately by emailing: **info@reolglobal.com**

Include in your report:
- A description of the vulnerability and its potential impact
- Steps to reproduce the issue
- Any supporting evidence (screenshots, logs, curl commands)

You will receive an acknowledgement within **48 hours** and a resolution update within **7 business days**.

---

## Security Architecture

REOL Nexus implements the following security controls:

### Authentication
- All authentication is handled by **Supabase Auth** — passwords are never stored in the application layer.
- Sessions are managed via **HTTP-only cookies** using `@supabase/ssr`.
- Session tokens are refreshed on every request via `middleware.ts`.

### Authorization
- All financial and operational data is protected by **PostgreSQL Row-Level Security (RLS)**.
- Permission checks are enforced at the database layer via `has_permission(perm_code, business_unit_id)`.
- UI-level access control is supplementary — the database is the single security boundary.
- Public tables (`public_enquiries`, `event_packages`, etc.) only allow `SELECT` for anonymous users. `INSERT` on `public_enquiries` is intentionally open for the lead capture pipeline.

### Environment Variables
- Supabase connection credentials are **never hard-coded**. They are loaded from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables.
- The Supabase **anon key** is safe to be public — all data access is controlled by RLS, not the key.
- The Supabase **service role key** is never used or stored in this application.

### Data
- No payment card data (PCI) is processed or stored.
- No personal health data (PHI/HIPAA) is processed or stored.
- User data (names, phone numbers, emails) is stored in Supabase Postgres and governed by RLS policies.

---

## Known Non-Issues

The following items may appear suspicious but are by design:

- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is visible in the browser. This is correct and safe — Supabase anon keys are designed to be public. Access control is enforced by RLS.
- The `public_enquiries` table allows unauthenticated `INSERT`. This is intentional — it is the lead capture mechanism for the public marketing site.
