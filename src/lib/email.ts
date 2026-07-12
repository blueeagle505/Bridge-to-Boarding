import { Resend } from "resend";
import {
  applicationReceivedEmail,
  applicationAcceptedEmail,
  applicationWaitlistedEmail,
  mentorAssignedEmail,
  mentorWelcomeEmail,
  verifyEmailEmail,
  resetPasswordEmail,
} from "@/emails/templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Bridge to Boarding <onboarding@resend.dev>";

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    // Fail safe in local/dev environments without an API key: log instead of throwing,
    // so the rest of the app flow (e.g. application submission) still completes.
    console.warn(`[email] RESEND_API_KEY not set — skipping send to ${to}: "${subject}"`);
    return { skipped: true };
  }
  return resend.emails.send({ from: FROM, to, subject, html });
}

export const mailer = {
  verifyEmail: (to: string, name: string, url: string) =>
    send(to, "Verify your Bridge to Boarding email", verifyEmailEmail(name, url)),

  resetPassword: (to: string, name: string, url: string) =>
    send(to, "Reset your Bridge to Boarding password", resetPasswordEmail(name, url)),

  applicationReceived: (to: string, name: string) =>
    send(to, "Bridge to Boarding Application Received", applicationReceivedEmail(name)),

  applicationAccepted: (to: string, name: string) =>
    send(to, "Great news from Bridge to Boarding!", applicationAcceptedEmail(name)),

  applicationWaitlisted: (to: string, name: string) =>
    send(to, "An update on your Bridge to Boarding application", applicationWaitlistedEmail(name)),

  mentorAssigned: (to: string, studentName: string, mentorName: string, mentorSchool: string) =>
    send(
      to,
      "You've been matched with a mentor!",
      mentorAssignedEmail(studentName, mentorName, mentorSchool)
    ),

  mentorWelcome: (to: string, name: string) =>
    send(to, "Welcome to the Bridge to Boarding mentor team", mentorWelcomeEmail(name)),
};
