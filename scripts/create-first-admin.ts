/**
 * Creates the first administrator account from environment variables.
 * Run once, after your first `prisma migrate deploy`, via:
 *
 *   npm run create-admin
 *
 * Requires FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD to be set (see .env.example).
 * Safe to re-run: if an admin already exists, it exits without making changes.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.env.FIRST_ADMIN_EMAIL;
  const password = process.env.FIRST_ADMIN_PASSWORD;
  const firstName = process.env.FIRST_ADMIN_FIRST_NAME || "Admin";
  const lastName = process.env.FIRST_ADMIN_LAST_NAME || "User";

  if (!email || !password) {
    console.error(
      "Missing FIRST_ADMIN_EMAIL or FIRST_ADMIN_PASSWORD in your environment. " +
        "Set these in .env before running `npm run create-admin`."
    );
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("FIRST_ADMIN_PASSWORD must be at least 10 characters.");
    process.exit(1);
  }

  const existingAdmin = await db.user.findFirst({ where: { role: "ADMIN" } });
  if (existingAdmin) {
    console.log(`An administrator already exists (${existingAdmin.email}). No changes made.`);
    console.log("To add more admins, sign in and use the Admin Users page in the dashboard.");
    process.exit(0);
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    const updated = await db.user.update({
      where: { email },
      data: { role: "ADMIN", emailVerified: new Date() },
    });
    console.log(`Promoted existing user ${updated.email} to ADMIN.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log(`First administrator created: ${admin.email}`);
  console.log("You can now sign in at /signin with this email and the password you set in FIRST_ADMIN_PASSWORD.");
  console.log("For security, remove FIRST_ADMIN_PASSWORD from your environment after this step.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
