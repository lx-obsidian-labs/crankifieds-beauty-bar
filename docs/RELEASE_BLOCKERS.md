# Release blockers

## Booking concurrency
The booking endpoint checks availability before inserting. Simultaneous requests may both pass. Before production, implement atomic overlap enforcement in the database including the configured buffer, then test simultaneous bookings and cancellation/rebooking across multiple instances.

## Storage
Production requires `DATABASE_URL`; verify persistence after cold starts and redeploys. The serverless fallback is now disabled.

## Administration
Review authorization on every admin endpoint, session expiry, cookie flags, rate limits and CSRF protections. Test unauthorized mutations.

## Evidence
Require CI, booking integration tests, owner-approved copy and imagery, accessibility checks, deployment verification and rollback documentation. Do not claim full double-booking protection before atomic enforcement.
