type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const LIMIT = 10;
const GLOBAL_LIMIT = 100;
const GLOBAL_KEY = "__global__";

const buckets = new Map<string, Bucket>();

function prune() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function peek(key: string, limit: number) {
  prune();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    return {
      wouldAllow: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (bucket.count >= limit) {
    return {
      wouldAllow: false,
      remaining: 0,
      resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return {
    wouldAllow: true,
    remaining: limit - bucket.count - 1,
    resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

function commit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    bucket.count += 1;
  }
}

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
} {
  const globalCheck = peek(GLOBAL_KEY, GLOBAL_LIMIT);
  if (!globalCheck.wouldAllow) {
    return { allowed: false, remaining: 0, resetInSeconds: globalCheck.resetInSeconds };
  }
  const ipCheck = peek(identifier, LIMIT);
  if (!ipCheck.wouldAllow) {
    return { allowed: false, remaining: 0, resetInSeconds: ipCheck.resetInSeconds };
  }
  commit(GLOBAL_KEY);
  commit(identifier);
  return {
    allowed: true,
    remaining: ipCheck.remaining,
    resetInSeconds: ipCheck.resetInSeconds,
  };
}

export function getClientIp(headers: Headers): string {
  if (process.env.TRUST_PROXY !== "true") {
    return "unknown";
  }
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
