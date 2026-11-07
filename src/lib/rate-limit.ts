type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function pruneBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(key: string, limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    if (!bucket && buckets.size >= MAX_BUCKETS) {
      pruneBuckets(now);
      // Never evict a live bucket to admit a fresh, possibly spoofed identity.
      // Saturation fails closed rather than resetting another client's limit.
      if (buckets.size >= MAX_BUCKETS) {
        return { allowed: false, retryAfter: Math.max(1, Math.ceil(windowMs / 1000)) };
      }
    }
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
  // Do not trust client-supplied X-Forwarded-For by default.
  // Only use a single-address header when an upstream trusted proxy is
  // configured to overwrite it and strip client-provided copies.
  const trustedHeader = process.env.TRUSTED_CLIENT_IP_HEADER?.toLowerCase();
  const supported = trustedHeader === "cf-connecting-ip" || trustedHeader === "x-real-ip";
  const raw = supported ? request.headers.get(trustedHeader) ?? "" : "";
  const ip = raw.length <= 45 && /^[a-fA-F0-9:.]+$/.test(raw) ? raw : "unidentified";
  return `${scope}:${ip}`;
}
