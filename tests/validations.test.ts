import { describe, it, expect } from "vitest";
import {
  signUpSchema,
  applicationSchema,
  mentorApplicationSchema,
  resetPasswordSchema,
} from "@/lib/validations";

describe("signUpSchema", () => {
  it("accepts a valid signup payload", () => {
    const result = signUpSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "StrongPass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a weak password missing a number", () => {
    const result = signUpSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "NoNumbersHere",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signUpSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "not-an-email",
      password: "StrongPass1",
    });
    expect(result.success).toBe(false);
  });
});

describe("applicationSchema", () => {
  const base = {
    firstName: "Jamie",
    lastName: "Rivera",
    email: "jamie@example.com",
    currentSchool: "Lincoln Middle School",
    state: "California",
    currentGrade: "GRADE_8" as const,
    gpa: "3.9",
    helpNeeded: "I would love help preparing for the SSAT and finding a good school fit.",
    agreedToTerms: true as const,
  };

  it("accepts a complete, valid application", () => {
    expect(applicationSchema.safeParse(base).success).toBe(true);
  });

  it("rejects when helpNeeded is too short", () => {
    const result = applicationSchema.safeParse({ ...base, helpNeeded: "Help me" });
    expect(result.success).toBe(false);
  });

  it("rejects when the terms checkbox is not checked", () => {
    const result = applicationSchema.safeParse({ ...base, agreedToTerms: false });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid grade value", () => {
    const result = applicationSchema.safeParse({ ...base, currentGrade: "GRADE_9" });
    expect(result.success).toBe(false);
  });
});

describe("mentorApplicationSchema", () => {
  const base = {
    name: "Sam Lee",
    email: "sam@example.com",
    school: "Deerfield Academy",
    graduationYear: new Date().getFullYear() + 1,
    currentGrade: "11th Grade",
    activities: "Debate team, varsity soccer",
    leadership: "Captain of the debate team",
    expertise: ["Essays", "Interviews"],
    availability: "Weeknights",
    motivation: "I want to help students the way my mentor helped me get through admissions.",
    agreedToTerms: true as const,
  };

  it("accepts a complete, valid mentor application", () => {
    expect(mentorApplicationSchema.safeParse(base).success).toBe(true);
  });

  it("rejects when no expertise areas are selected", () => {
    const result = mentorApplicationSchema.safeParse({ ...base, expertise: [] });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("requires a token and a strong password", () => {
    const result = resetPasswordSchema.safeParse({ token: "abc123", password: "StrongPass1" });
    expect(result.success).toBe(true);
  });

  it("rejects a missing token", () => {
    const result = resetPasswordSchema.safeParse({ token: "", password: "StrongPass1" });
    expect(result.success).toBe(false);
  });
});
