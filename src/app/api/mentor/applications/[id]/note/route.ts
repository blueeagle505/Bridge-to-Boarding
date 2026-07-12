import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { z } from "zod";

const schema = z.object({ body: z.string().trim().min(1).max(4000) });

// Notes created here are only ever surfaced in the admin dashboard —
// never returned by the applicant-facing /api/applications route.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole("MENTOR", "ADMIN");
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Note cannot be empty." }, { status: 400 });

    if (user.role === "MENTOR") {
      const profile = await db.mentorProfile.findUnique({ where: { userId: user.id } });
      const application = await db.application.findUnique({ where: { id: params.id } });
      if (!profile || !application || application.mentorId !== profile.id) {
        return NextResponse.json({ error: "You are not assigned to this student." }, { status: 403 });
      }
    }

    const note = await db.adminNote.create({
      data: { applicationId: params.id, authorId: user.id, body: parsed.data.body },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
