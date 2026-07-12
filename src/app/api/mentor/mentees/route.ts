import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  try {
    const user = await requireRole("MENTOR", "ADMIN");

    const profile = await db.mentorProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ mentees: [] });

    const mentees = await db.application.findMany({
      where: { mentorId: profile.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ mentees, mentorProfile: profile });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
