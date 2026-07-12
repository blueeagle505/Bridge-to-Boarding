import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mentorApplicationSchema } from "@/lib/validations";
import { requireUser } from "@/lib/rbac";
import { rateLimit, getClientIp } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const ip = getClientIp(req.headers);
    const { success } = rateLimit(`mentor-apply:${user.id}`, 5, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }
    void ip;

    const json = await req.json().catch(() => null);
    const parsed = mentorApplicationSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    const data = parsed.data;

    const existing = await db.mentorProfile.findUnique({ where: { userId: user.id } });
    if (existing) {
      return NextResponse.json({ error: "You've already submitted a mentor application." }, { status: 409 });
    }

    const profile = await db.mentorProfile.create({
      data: {
        userId: user.id,
        school: data.school,
        graduationYear: data.graduationYear,
        currentGrade: data.currentGrade,
        activities: data.activities,
        leadership: data.leadership,
        expertise: data.expertise,
        availability: data.availability,
        motivation: data.motivation,
        status: "PENDING",
      },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
