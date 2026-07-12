const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

function layout(title: string, bodyHtml: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8" /><title>${title}</title></head>
  <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <tr>
              <td style="background:#0a0a0c;padding:28px 40px;">
                <span style="color:#ffffff;font-size:18px;font-weight:600;letter-spacing:-0.01em;">Bridge to Boarding</span>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;color:#1d1d1f;font-size:15px;line-height:1.7;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;background:#fafafa;color:#86868b;font-size:12px;">
                Bridge to Boarding is a free, student-led mentorship initiative and is not affiliated with any boarding school.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#0a0a0c;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">${label}</a>`;
}

export function verifyEmailEmail(name: string, url: string) {
  return layout(
    "Verify your email",
    `<h1 style="font-size:22px;margin:0 0 16px;">Hi ${name}, verify your email</h1>
     <p>Thanks for creating a Bridge to Boarding account. Please confirm your email address to activate your account and start (or continue) your application.</p>
     ${button(url, "Verify Email")}
     <p style="margin-top:24px;color:#86868b;font-size:13px;">This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>`
  );
}

export function resetPasswordEmail(name: string, url: string) {
  return layout(
    "Reset your password",
    `<h1 style="font-size:22px;margin:0 0 16px;">Hi ${name}, reset your password</h1>
     <p>We received a request to reset your Bridge to Boarding password. Click below to choose a new one.</p>
     ${button(url, "Reset Password")}
     <p style="margin-top:24px;color:#86868b;font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`
  );
}

export function applicationReceivedEmail(name: string) {
  return layout(
    "Application Received",
    `<h1 style="font-size:22px;margin:0 0 16px;">Thank you for applying, ${name}.</h1>
     <p>Your application has been received. Our volunteer admissions team reviews every application carefully.</p>
     <p>If accepted, you should expect to be matched with a mentor within approximately <strong>3–5 business days</strong>.</p>
     <p>We'll notify you by email as soon as a decision has been made.</p>
     ${button(`${APP_URL}/dashboard`, "View Your Dashboard")}`
  );
}

export function applicationAcceptedEmail(name: string) {
  return layout(
    "You're in!",
    `<h1 style="font-size:22px;margin:0 0 16px;">Congratulations, ${name}!</h1>
     <p>Your Bridge to Boarding application has been accepted. We're now finding the right mentor for you based on your goals and interests.</p>
     <p>You'll receive another email the moment a mentor is assigned.</p>
     ${button(`${APP_URL}/dashboard`, "View Your Dashboard")}`
  );
}

export function applicationWaitlistedEmail(name: string) {
  return layout(
    "Application Update",
    `<h1 style="font-size:22px;margin:0 0 16px;">Hi ${name},</h1>
     <p>Thank you for your patience. Right now we have more applicants than available mentors, so your application has been placed on our waitlist.</p>
     <p>We'll reach out the moment a mentor becomes available. This is not a rejection — many waitlisted students are matched within a few weeks.</p>
     ${button(`${APP_URL}/dashboard`, "View Your Dashboard")}`
  );
}

export function mentorAssignedEmail(studentName: string, mentorName: string, mentorSchool: string) {
  return layout(
    "Mentor Assigned",
    `<h1 style="font-size:22px;margin:0 0 16px;">You've been matched, ${studentName}!</h1>
     <p>We're excited to let you know that <strong>${mentorName}</strong>, a current student at <strong>${mentorSchool}</strong>, will be your mentor throughout your admissions journey.</p>
     <p>Log in to your dashboard to send them a message and get started.</p>
     ${button(`${APP_URL}/dashboard`, "Message Your Mentor")}`
  );
}

export function mentorWelcomeEmail(name: string) {
  return layout(
    "Welcome to the team",
    `<h1 style="font-size:22px;margin:0 0 16px;">Welcome, ${name}!</h1>
     <p>Your mentor application has been approved. Thank you for volunteering your time to help the next generation of boarding school students.</p>
     <p>Log in to your mentor dashboard to view your profile and, soon, your assigned mentees.</p>
     ${button(`${APP_URL}/mentor/dashboard`, "Go to Mentor Dashboard")}`
  );
}
