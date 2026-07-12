import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type Role = "APPLICANT" | "MENTOR" | "ADMIN";

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "You must be signed in to do that.") {
    super(message);
  }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "You do not have permission to do that.") {
    super(message);
  }
}

/** Get the current session's user, throwing if unauthenticated. */
export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new UnauthorizedError();
  return session.user;
}

/** Require the current user to hold one of the given roles. */
export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new ForbiddenError();
  return user;
}
