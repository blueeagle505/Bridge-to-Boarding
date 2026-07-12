import { describe, it, expect, beforeEach, vi } from "vitest";
import { cn, generateToken, rateLimit, STATUS_LABELS } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});

describe("generateToken", () => {
  it("generates a 64-character hex token", () => {
    const token = generateToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it("generates unique tokens on each call", () => {
    expect(generateToken()).not.toBe(generateToken());
  });
});

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const key = `test-${Math.random()}`;
    const first = rateLimit(key, 3, 60_000);
    const second = rateLimit(key, 3, 60_000);
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    const third = rateLimit(key, 2, 60_000);
    expect(third.success).toBe(false);
  });
});

describe("STATUS_LABELS", () => {
  it("has a human-readable label for every application status", () => {
    const statuses = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "MENTOR_ASSIGNED", "WAITLISTED", "REJECTED", "CLOSED"];
    for (const s of statuses) {
      expect(STATUS_LABELS[s]).toBeTruthy();
    }
  });
});
