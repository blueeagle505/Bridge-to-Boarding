import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminApplicationActionSchema } from "@/lib/validations";
import { requireRole } from "@/lib/rbac";
import { mailer } from "@/lib/email";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole("ADMIN");
    const application = await db.application.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, createdAt: true } },
        mentor: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { firstName: true, lastName: true } } } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });
    return NextResponse.json({ application });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole("ADMIN");

    const json = await req.json().catch(() => null);
    const parsed = adminApplicationActionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    const { action, mentorId, note, status } = parsed.data;

    const application = await db.application.findUnique({ where: { id: params.id } });
    if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });

    switch (action) {
      case "APPROVE": {
        const updated = await db.application.update({
          where: { id: params.id },
          data: { status: "UNDER_REVIEW", reviewedAt: new Date() },
        });
        await mailer.applicationAccepted(application.email, application.firstName);
        await logAudit(admin.id, "APPLICATION_APPROVED", params.id);
        return NextResponse.json({ application: updated });
      }
      case "WAITLIST": {
        const updated = await db.application.update({
          where: { id: params.id },
          data: { status: "WAITLISTED", reviewedAt: new Date() },
        });
        await mailer.applicationWaitlisted(application.email, application.firstName);
        await logAudit(admin.id, "APPLICATION_WAITLISTED", params.id);
        return NextResponse.json({ application: updated });
      }
      case "REJECT": {
        const updated = await db.application.update({
          where: { id: params.id },
          data: { status: "REJECTED", reviewedAt: new Date() },
        });
        await logAudit(admin.id, "APPLICATION_REJECTED", params.id);
        return NextResponse.json({ application: updated });
      }
      case "ASSIGN_MENTOR": {
        if (!mentorId) return NextResponse.json({ error: "mentorId is required." }, { status: 400 });

        const mentor = await db.mentorProfile.findUnique({
          where: { id: mentorId },
          include: { user: true, mentees: true },
        });
        if (!mentor || mentor.status !== "APPROVED") {
          return NextResponse.json({ error: "Mentor not found or not approved." }, { status: 400 });
        }
        if (mentor.mentees.length >= mentor.maxCapacity) {
          return NextResponse.json({ error: "This mentor is at full capacity." }, { status: 400 });
        }

        const updated = await db.application.update({
          where: { id: params.id },
          data: { status: "MENTOR_ASSIGNED", mentorId, reviewedAt: new Date() },
        });
        await mailer.mentorAssigned(application.email, application.firstName, mentor.user.firstName + " " + mentor.user.lastName, mentor.school);
        await logAudit(admin.id, "MENTOR_ASSIGNED", params.id, { mentorId });
        return NextResponse.json({ application: updated });
      }
      case "ADD_NOTE": {
        if (!note) return NextResponse.json({ error: "Note text is required." }, { status: 400 });
        const created = await db.adminNote.create({
          data: { applicationId: params.id, authorId: admin.id, body: note },
        });
        await logAudit(admin.id, "NOTE_ADDED", params.id);
        return NextResponse.json({ note: created });
      }
      case "SET_STATUS": {
        if (!status) return NextResponse.json({ error: "status is required." }, { status: 400 });
        const updated = await db.application.update({
          where: { id: params.id },
          data: { status },
        });
        await logAudit(admin.id, "STATUS_CHANGED", params.id, { status });
        return NextResponse.json({ application: updated });
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}

async function logAudit(userId: string, action: string, targetId: string, metadata?: Record<string, unknown>) {
  await db.auditLog.create({ data: { userId, action, targetId, metadata } });
}
