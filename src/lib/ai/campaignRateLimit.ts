type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type CampaignRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

const defaultMaxRequests = 10;
const minMaxRequests = 1;
const maxMaxRequests = 100;
const defaultWindowMs = 60_000;
const minWindowMs = 10_000;
const maxWindowMs = 60 * 60_000;
const maxTrackedClients = 1_000;
const buckets = new Map<string, RateLimitBucket>();

function readBoundedInteger(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();

  return (forwardedFor || realIp || "unknown").slice(0, 128);
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function makeRoomForNewClient() {
  if (buckets.size < maxTrackedClients) {
    return;
  }

  const oldestKey = buckets.keys().next().value;

  if (oldestKey) {
    buckets.delete(oldestKey);
  }
}

export function consumeCampaignRateLimit(
  request: Request,
): CampaignRateLimitResult {
  if (process.env.AI_RATE_LIMIT_ENABLED === "false") {
    return {
      allowed: true,
      limit: defaultMaxRequests,
      remaining: defaultMaxRequests,
      retryAfterSeconds: 0,
    };
  }

  const limit = readBoundedInteger(
    process.env.AI_RATE_LIMIT_MAX_REQUESTS,
    defaultMaxRequests,
    minMaxRequests,
    maxMaxRequests,
  );
  const windowMs = readBoundedInteger(
    process.env.AI_RATE_LIMIT_WINDOW_MS,
    defaultWindowMs,
    minWindowMs,
    maxWindowMs,
  );
  const now = Date.now();
  const key = getClientIdentifier(request);
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    pruneExpiredBuckets(now);
    makeRoomForNewClient();
    bucket = {
      count: 0,
      resetAt: now + windowMs,
    };
    buckets.set(key, bucket);
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((bucket.resetAt - now) / 1_000),
  );

  if (bucket.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  bucket.count += 1;

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds,
  };
}
