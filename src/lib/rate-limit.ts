type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function pruneBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // The limiter is best-effort and process-local. Cap its memory even when
  // untrusted clients continuously present distinct forwarded addresses.
  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
}

export function rateLimit(key: string, limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    if (!bucket && buckets.size >= MAX_BUCKETS) pruneBuckets(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfter: 0 };
}

export function clientKey(request: Request, scope: string) {
  // x-forwarded-for must be normalized by a trusted reverse proxy.
  // Never treat this process-local key as a distributed security boundary.
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "local";
  return `${scope}:${ip}`;
}
