import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import { requireUser } from "@/lib/rbac";
import { mailer } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/utils";

// GET: the signed-in applicant's own application (used by dashboard).
export async function GET() {
  try {
    const user = await requireUser();
    const application = await db.application.findUnique({
      where: { userId: user.id },
      include: {
        mentor: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { firstName: true, role: true } } } },
      },
    });
    return NextResponse.json({ application });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

// POST: submit (create or update+submit) the applicant's application.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const ip = getClientIp(req.headers);
    const { success } = rateLimit(`apply:${user.id}`, 10, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }
    void ip;

    // Applications require a verified email — enforced server-side, not just client-side.
    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser?.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before submitting an application." },
        { status: 403 }
      );
    }

    const json = await req.json().catch(() => null);
    const parsed = applicationSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input." }, { status: 400 });
    }

    const data = parsed.data;

    const application = await db.application.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        currentSchool: data.currentSchool,
        state: data.state,
        currentGrade: data.currentGrade,
        gpa: data.gpa,
        helpNeeded: data.helpNeeded,
        agreedToTerms: data.agreedToTerms,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        currentSchool: data.currentSchool,
        state: data.state,
        currentGrade: data.currentGrade,
        gpa: data.gpa,
        helpNeeded: data.helpNeeded,
        agreedToTerms: data.agreedToTerms,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    await mailer.applicationReceived(data.email, data.firstName);

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
