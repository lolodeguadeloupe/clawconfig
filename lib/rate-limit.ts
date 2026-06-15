type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
const MAX_KEYS = 10_000

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
  retryAfterSec: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()

  if (buckets.size > MAX_KEYS) {
    buckets.forEach((b, k) => {
      if (b.resetAt < now) buckets.delete(k)
    })
    if (buckets.size > MAX_KEYS) buckets.clear()
  }

  const existing = buckets.get(key)
  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt, retryAfterSec: 0 }
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count++
  return {
    ok: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
    retryAfterSec: 0,
  }
}

export function clientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip') || 'unknown'
}
