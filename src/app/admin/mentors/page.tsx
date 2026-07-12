"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

type Mentor = {
  id: string;
  school: string;
  graduationYear: number;
  expertise: string[];
  status: string;
  maxCapacity: number;
  mentees: { id: string }[];
  user: { firstName: string; lastName: string; email: string };
};

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/mentors").then((r) => r.json()).then((d) => setMentors(d.mentors ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function act(mentorId: string, action: "APPROVE" | "REJECT") {
    setBusyId(mentorId);
    await fetch("/api/admin/mentors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId, action }),
    });
    setBusyId(null);
    load();
  }

  const pending = mentors.filter((m) => m.status === "PENDING");
  const approved = mentors.filter((m) => m.status === "APPROVED");

  return (
    <div>
      <h1 className="font-display text-3xl font-medium tracking-tight">Mentors</h1>

      {pending.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pending Applications</h2>
          <div className="mt-4 space-y-3">
            {pending.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
                <div>
                  <p className="font-medium">{m.user.firstName} {m.user.lastName}</p>
                  <p className="text-sm text-muted-foreground">{m.school} · Class of {m.graduationYear}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.expertise.join(", ")}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={busyId === m.id} onClick={() => act(m.id, "APPROVE")}>
                    <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-500" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" disabled={busyId === m.id} onClick={() => act(m.id, "REJECT")}>
                    <XCircle className="mr-1.5 h-4 w-4 text-rose-500" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active Mentors</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-foreground/8 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/8 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Mentor</th>
                <th className="px-5 py-3 font-medium">School</th>
                <th className="px-5 py-3 font-medium">Expertise</th>
                <th className="px-5 py-3 font-medium">Mentees</th>
              </tr>
            </thead>
            <tbody>
              {approved.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No approved mentors yet.</td></tr>
              ) : (
                approved.map((m) => (
                  <tr key={m.id} className="border-b border-foreground/5 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-medium">{m.user.firstName} {m.user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{m.user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{m.school}</td>
                    <td className="px-5 py-4 text-muted-foreground">{m.expertise.join(", ")}</td>
                    <td className="px-5 py-4 text-muted-foreground">{m.mentees.length} / {m.maxCapacity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
