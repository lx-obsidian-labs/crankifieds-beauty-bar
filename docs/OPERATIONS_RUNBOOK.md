# Crankified's Beauty Bar — Booking and Admin Operations

**Reviewed:** 2026-11-07 · **Stage:** Active development; production release readiness not verified.

## Technical boundaries

The package manifest declares Next.js 16, React 19, Neon PostgreSQL driver, TypeScript, ESLint and Node tests. Booking availability and administrative operations must be validated against database state, not solely against browser controls.

## Local verification

```bash
npm ci
npm run test
npm run typecheck
npm run lint
npm run build
```

These are manifest-backed commands. **Passing execution is not confirmed by this runbook.**

## Release checklist

1. Review required environment variable names in `.env.example`; never commit secret values.
2. Confirm `DATABASE_URL`, admin passcode and signing secret are configured securely in the target environment.
3. Verify PostgreSQL migrations and the booking-overlap exclusion constraint against an isolated database.
4. Exercise concurrent booking requests and verify exactly one conflicting reservation is accepted.
5. Test admin login, expired/tampered sessions, logout, cross-site request protections and authorization on every privileged endpoint.
6. Check rate limiting behind the configured trusted proxy and multiple application instances.
7. Validate booking notices, customer-visible confirmation, calendar downloads and mobile/accessibility flows.
8. Review backups, monitoring, rollback and customer data retention with the operator.

## Incident playbooks

- **Duplicate booking:** Preserve request IDs and affected slot data; inspect exclusion constraints and transaction handling before manual reconciliation.
- **Admin access failure:** Verify required secrets, cookies, time synchronization and proxy/origin configuration without printing secrets.
- **Suspected compromised admin session:** Rotate signing secret and passcode, revoke access where supported and investigate logs without exposing customer records.
- **Database outage:** Fail closed for bookings; do not fabricate successful confirmation.
- **Rate limiting issue:** Inspect trusted IP-header configuration and distributed behavior; never disable abuse controls without a safer alternative.

## Evidence record

```md
Reviewed commit:
Node version:
Test/typecheck/lint/build results:
Database migration and concurrency test:
Admin session and CSRF test:
Rate limiting/proxy test:
Production smoke test:
Rollback target:
Known blockers:
```

[README](../README.md) · [Release blockers](RELEASE_BLOCKERS.md) · [Case study](ENGINEERING_CASE_STUDY.md)
