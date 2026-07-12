import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import type { ApplicationStatus, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireRole("ADMIN");

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q")?.trim();
    const status = searchParams.get("status") as ApplicationStatus | null;
    const state = searchParams.get("state");
    const sort = searchParams.get("sort") || "createdAt";
    const dir = (searchParams.get("dir") as "asc" | "desc") || "desc";

    const where: Prisma.ApplicationWhereInput = {
      status: status && status !== ("ALL" as never) ? status : undefined,
      state: state && state !== "ALL" ? state : undefined,
      OR: search
        ? [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { currentSchool: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const applications = await db.application.findMany({
      where,
      orderBy: { [sort]: dir },
      include: { mentor: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    return NextResponse.json({ applications });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    return NextResponse.json({ error: (err as Error).message }, { status });
  }
}
