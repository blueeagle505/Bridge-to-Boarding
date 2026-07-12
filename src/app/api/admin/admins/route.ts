import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createAdminSchema } from "@/lib/validations";
import { requireRole } from "@/lib/rbac";

// Only existing admins can create new admins — enforced by requireRole.
// This is how additional administrators are provisioned after the very
// first admin is created via the one-time setup script (see README).
export async function POST(req: NextRequest) {
  try {
    await requireRole("ADMIN");

    const parsed = createAdminSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    const { firstName, lastName, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: "ADMIN",
        emailVerified: new Date(), // Admin-created accounts are pre-verified.
      },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });

    return NextResponse.json({ admin }, { status: 201 });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function GET() {
  try {
    await requireRole("ADMIN");
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ admins });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
