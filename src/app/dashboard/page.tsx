"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import { FileText, MessageSquare, User, Sparkles } from "lucide-react";

type Application = {
  id: string;
  status: string;
  currentSchool: string;
  submittedAt: string | null;
  createdAt: string;
  mentor: { school: string; user: { firstName: string; lastName: string; email: string } } | null;
  messages: { id: string; body: string; createdAt: string; sender: { firstName: string; role: string } }[];
} | null;

export default function DashboardPage() {
  const [application, setApplication] = useState<Application>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => setApplication(d.application))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-4xl">
        <h1 className="font-display text-4xl font-medium tracking-tight">Your Dashboard</h1>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading...</p>
        ) : !application ? (
          <div className="mt-10 rounded-2xl border border-foreground/8 bg-white p-10 text-center shadow-sm">
            <Sparkles className="mx-auto h-8 w-8 text-accent" />
            <h2 className="mt-4 font-display text-xl font-medium">You haven't applied yet</h2>
            <p className="mt-2 text-muted-foreground">Submit your application to get matched with a mentor.</p>
            <Button asChild className="mt-6"><Link href="/apply">Start Application</Link></Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-medium">Application Status</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[application.status]}`}>
                    {STATUS_LABELS[application.status]}
                  </span>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">School</dt>
                    <dd className="mt-1 font-medium">{application.currentSchool}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Submitted</dt>
                    <dd className="mt-1 font-medium">{application.submittedAt ? formatDate(application.submittedAt) : "—"}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
                <h2 className="flex items-center gap-2 font-display text-xl font-medium">
                  <MessageSquare className="h-5 w-5" /> Messages
                </h2>
                {application.messages.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No messages yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {application.messages.map((m) => (
                      <div key={m.id} className="rounded-xl bg-secondary/50 p-4 text-sm">
                        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                          <span className="font-medium">{m.sender.firstName}</span>
                          <span>{formatDate(m.createdAt)}</span>
                        </div>
                        {m.body}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-display text-base font-medium">
                  <User className="h-4 w-4" /> Your Mentor
                </h3>
                {application.mentor ? (
                  <div className="mt-3 text-sm">
                    <p className="font-medium">{application.mentor.user.firstName} {application.mentor.user.lastName}</p>
                    <p className="text-muted-foreground">{application.mentor.school}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{application.mentor.user.email}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Not yet assigned. You'll be notified by email once matched.</p>
                )}
              </div>

              <div className="rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-display text-base font-medium">
                  <FileText className="h-4 w-4" /> Resources
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">Free guides to help you prepare.</p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link href="/resources">Browse Resources</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
