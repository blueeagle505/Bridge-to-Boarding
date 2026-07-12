import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/utils";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many messages. Please try again shortly." }, { status: 429 });
  }

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { name, email, message } = parsed.data;

  const adminEmail = process.env.CONTACT_INBOX_EMAIL || "hello@bridgetoboarding.org";

  if (resend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Bridge to Boarding <onboarding@resend.dev>",
      to: adminEmail,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
    });
  } else {
    console.warn(`[contact] RESEND_API_KEY not set — message from ${email} logged only.`);
  }

  return NextResponse.json({ message: "Thanks for reaching out — we'll be in touch soon." });
}
