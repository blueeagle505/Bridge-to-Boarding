import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations";
import { generateToken, rateLimit, getClientIp } from "@/lib/utils";
import { mailer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`forgot-password:${ip}`, 5, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a minute." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  // Always respond with the same message to avoid leaking account existence.
  const genericResponse = NextResponse.json(
    { message: "If an account exists for that email, a reset link has been sent." },
    { status: 200 }
  );

  if (!user) return genericResponse;

  const token = generateToken();
  await db.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
  });

  const url = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await mailer.resetPassword(user.email, user.firstName, url);

  return genericResponse;
}
