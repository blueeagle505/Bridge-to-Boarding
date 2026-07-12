import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { mailer } from "@/lib/email";
import { z } from "zod";

export async function GET() {
  try {
    await requireRole("ADMIN");
    const mentors = await db.mentorProfile.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        mentees: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ mentors });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

const actionSchema = z.object({
  mentorId: z.string(),
  action: z.enum(["APPROVE", "REJECT"]),
});

export async function PATCH(req: NextRequest) {
  try {
    await requireRole("ADMIN");
    const parsed = actionSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

    const mentor = await db.mentorProfile.update({
      where: { id: parsed.data.mentorId },
      data: { status: parsed.data.action === "APPROVE" ? "APPROVED" : "REJECTED" },
      include: { user: true },
    });

    if (parsed.data.action === "APPROVE") {
      // Only promote to MENTOR if they aren't already an ADMIN — approving
      // your own mentor application as an admin should let you act as a
      // mentor without losing admin access.
      if (mentor.user.role !== "ADMIN") {
        await db.user.update({ where: { id: mentor.userId }, data: { role: "MENTOR" } });
      }
      await mailer.mentorWelcome(mentor.user.email, mentor.user.firstName);
    }

    return NextResponse.json({ mentor });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}