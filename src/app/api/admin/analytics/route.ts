import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  try {
    await requireRole("ADMIN");

    const [total, submitted, underReview, mentorAssigned, waitlisted, rejected, mentors, recentApplications] =
      await Promise.all([
        db.application.count(),
        db.application.count({ where: { status: "SUBMITTED" } }),
        db.application.count({ where: { status: "UNDER_REVIEW" } }),
        db.application.count({ where: { status: "MENTOR_ASSIGNED" } }),
        db.application.count({ where: { status: "WAITLISTED" } }),
        db.application.count({ where: { status: "REJECTED" } }),
        db.mentorProfile.count({ where: { status: "APPROVED" } }),
        db.application.findMany({
          take: 8,
          orderBy: { updatedAt: "desc" },
          select: { id: true, firstName: true, lastName: true, status: true, updatedAt: true },
        }),
      ]);

    const reviewed = await db.application.findMany({
      where: { reviewedAt: { not: null }, submittedAt: { not: null } },
      select: { submittedAt: true, reviewedAt: true },
    });
    const avgReviewMs =
      reviewed.length > 0
        ? reviewed.reduce((sum, a) => sum + (a.reviewedAt!.getTime() - a.submittedAt!.getTime()), 0) / reviewed.length
        : 0;
    const avgReviewDays = Math.round((avgReviewMs / (1000 * 60 * 60 * 24)) * 10) / 10;

    const byStateRaw = await db.application.groupBy({ by: ["state"], _count: true });
    const byState = byStateRaw
      .map((r) => ({ state: r.state, count: r._count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({
      total,
      pending: submitted + underReview,
      approved: mentorAssigned,
      rejected,
      waitlisted,
      mentors,
      avgReviewDays,
      recentApplications,
      byState,
      funnel: { submitted, underReview, mentorAssigned, waitlisted, rejected },
    });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
