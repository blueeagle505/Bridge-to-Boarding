import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({ token: null }));
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
  }

  const record = await db.verificationToken.findUnique({ where: { token } });
  if (!record) {
    return NextResponse.json({ error: "This verification link is invalid or has already been used." }, { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    await db.verificationToken.delete({ where: { id: record.id } });
    return NextResponse.json({ error: "This verification link has expired. Please request a new one." }, { status: 400 });
  }

  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }),
    db.verificationToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return NextResponse.json({ message: "Email verified. You can now sign in." }, { status: 200 });
}
