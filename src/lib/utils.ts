import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  MENTOR_ASSIGNED: "Mentor Assigned",
  WAITLISTED: "Waitlisted",
  REJECTED: "Not Selected",
  CLOSED: "Closed",
};

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  MENTOR_ASSIGNED: "bg-emerald-100 text-emerald-700",
  WAITLISTED: "bg-purple-100 text-purple-700",
  REJECTED: "bg-rose-100 text-rose-700",
  CLOSED: "bg-slate-200 text-slate-600",
};

/**
 * Minimal in-memory sliding-window rate limiter.
 * Suitable for single-instance deployments / demo purposes.
 * For multi-instance production deployments, swap this for a Redis-backed
 * limiter (e.g. Upstash Ratelimit) — the call sites are already isolated
 * behind the `rateLimit()` function so the swap is a one-file change.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
