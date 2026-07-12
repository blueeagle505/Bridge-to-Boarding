import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/validations";
import { generateToken, rateLimit, getClientIp } from "@/lib/utils";
import { mailer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`register:${ip}`, 5, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a minute." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = signUpSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { firstName, lastName, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // Do not reveal whether the account exists — respond identically either way.
    return NextResponse.json(
      { message: "If that email is available, we've sent a verification link." },
      { status: 200 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { firstName, lastName, email, passwordHash, role: "APPLICANT" },
  });

  const token = generateToken();
  await db.verificationToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  });

  const url = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  await mailer.verifyEmail(user.email, user.firstName, url);

  return NextResponse.json(
    { message: "Account created. Check your email to verify your address." },
    { status: 201 }
  );
}
