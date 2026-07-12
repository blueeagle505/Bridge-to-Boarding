"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CheckCircle2, Clock, XCircle, UserPlus } from "lucide-react";

type Mentor = { id: string; school: string; maxCapacity: number; mentees: { id: string }[]; user: { firstName: string; lastName: string } };

type Detail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentSchool: string;
  currentGrade: string;
  state: string;
  gpa: string;
  helpNeeded: string;
  status: string;
  createdAt: string;
  mentor: { id: string; school: string; user: { firstName: string; lastName: string; email: string } } | null;
  notes: { id: string; body: string; createdAt: string; author: { firstName: string; lastName: string } }[];
};

export default function AdminApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const [app, setApp] = useState<Detail | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [note, setNote] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/applications/${params.id}`).then((r) => r.json()).then((d) => setApp(d.application));
    fetch(`/api/admin/mentors`).then((r) => r.json()).then((d) => setMentors((d.mentors ?? []).filter((m: any) => m.status === "APPROVED")));
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  async function runAction(body: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch(`/api/admin/applications/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (res.ok) load();
  }

  if (!app) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-medium">{app.firstName} {app.lastName}</h1>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[app.status]}`}>
              {STATUS_LABELS[app.status]}
            </span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div><dt className="text-muted-foreground">Email</dt><dd className="mt-1 font-medium">{app.email}</dd></div>
            <div><dt className="text-muted-foreground">School</dt><dd className="mt-1 font-medium">{app.currentSchool}</dd></div>
            <div><dt className="text-muted-foreground">Grade</dt><dd className="mt-1 font-medium">{app.currentGrade === "GRADE_7" ? "7th" : "8th"}</dd></div>
            <div><dt className="text-muted-foreground">State</dt><dd className="mt-1 font-medium">{app.state}</dd></div>
            <div><dt className="text-muted-foreground">GPA</dt><dd className="mt-1 font-medium">{app.gpa}</dd></div>
            <div><dt className="text-muted-foreground">Applied</dt><dd className="mt-1 font-medium">{formatDate(app.createdAt)}</dd></div>
          </dl>
          <div className="mt-6">
            <dt className="text-sm text-muted-foreground">What they need help with</dt>
            <dd className="mt-2 whitespace-pre-wrap rounded-xl bg-secondary/40 p-4 text-sm leading-relaxed">{app.helpNeeded}</dd>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
          <h2 className="font-display text-lg font-medium">Admin Notes</h2>
          <div className="mt-4 space-y-3">
            {app.notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
            {app.notes.map((n) => (
              <div key={n.id} className="rounded-xl bg-secondary/40 p-4 text-sm">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span className="font-medium">{n.author.firstName} {n.author.lastName}</span>
                  <span>{formatDate(n.createdAt)}</span>
                </div>
                {n.body}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a private note..." className="min-h-[70px]" />
            <Button
              disabled={busy || !note.trim()}
              onClick={async () => { await runAction({ action: "ADD_NOTE", note }); setNote(""); }}
              className="self-end"
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
          <h3 className="font-display text-base font-medium">Review Actions</h3>
          <div className="mt-4 space-y-2">
            <Button disabled={busy} onClick={() => runAction({ action: "APPROVE" })} className="w-full justify-start" variant="outline">
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Approve for Review
            </Button>
            <Button disabled={busy} onClick={() => runAction({ action: "WAITLIST" })} className="w-full justify-start" variant="outline">
              <Clock className="mr-2 h-4 w-4 text-purple-500" /> Waitlist
            </Button>
            <Button disabled={busy} onClick={() => runAction({ action: "REJECT" })} className="w-full justify-start" variant="outline">
              <XCircle className="mr-2 h-4 w-4 text-rose-500" /> Reject
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-display text-base font-medium">
            <UserPlus className="h-4 w-4" /> Assign Mentor
          </h3>
          {app.mentor ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Currently assigned to <strong>{app.mentor.user.firstName} {app.mentor.user.lastName}</strong> ({app.mentor.school}).
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <Select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
                <option value="">Select a mentor</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.mentees.length >= m.maxCapacity}>
                    {m.user.firstName} {m.user.lastName} — {m.school} ({m.mentees.length}/{m.maxCapacity})
                  </option>
                ))}
              </Select>
              <Button
                disabled={busy || !selectedMentor}
                onClick={() => runAction({ action: "ASSIGN_MENTOR", mentorId: selectedMentor })}
                className="w-full"
              >
                Assign
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
