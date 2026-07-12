"use client";

import { useEffect, useState } from "react";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import { Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Mentee = {
  id: string;
  firstName: string;
  lastName: string;
  currentSchool: string;
  status: string;
  helpNeeded: string;
  messages: { id: string; body: string; createdAt: string; senderId: string }[];
};

export default function MentorDashboardPage() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  function load() {
    fetch("/api/mentor/mentees")
      .then((r) => r.json())
      .then((d) => {
        setMentees(d.mentees ?? []);
        if (d.mentees?.[0]) setActive((prev) => prev ?? d.mentees[0].id);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const activeMentee = mentees.find((m) => m.id === active);

  async function sendMessage() {
    if (!active || !draft.trim()) return;
    setSending(true);
    await fetch(`/api/mentor/applications/${active}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });
    setDraft("");
    setSending(false);
    load();
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-5xl">
        <h1 className="font-display text-4xl font-medium tracking-tight">Mentor Dashboard</h1>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading...</p>
        ) : mentees.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-foreground/8 bg-white p-10 text-center shadow-sm">
            <Users className="mx-auto h-8 w-8 text-accent" />
            <h2 className="mt-4 font-display text-xl font-medium">No mentees assigned yet</h2>
            <p className="mt-2 text-muted-foreground">Once an admin assigns you a student, they'll appear here.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              {mentees.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition-colors ${
                    active === m.id ? "border-foreground bg-white shadow-sm" : "border-foreground/8 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{m.firstName} {m.lastName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[m.status]}`}>
                      {STATUS_LABELS[m.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.currentSchool}</p>
                </button>
              ))}
            </div>

            {activeMentee && (
              <div className="lg:col-span-2 rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
                <h2 className="font-display text-xl font-medium">{activeMentee.firstName} {activeMentee.lastName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{activeMentee.helpNeeded}</p>

                <div className="mt-6 max-h-72 space-y-3 overflow-y-auto rounded-xl bg-secondary/40 p-4">
                  {activeMentee.messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages yet — say hello!</p>
                  ) : (
                    activeMentee.messages.map((m) => (
                      <div key={m.id} className="rounded-lg bg-white p-3 text-sm shadow-sm">
                        <div className="mb-1 text-xs text-muted-foreground">{formatDate(m.createdAt)}</div>
                        {m.body}
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a message to your mentee..."
                    className="min-h-[80px]"
                  />
                  <Button onClick={sendMessage} disabled={sending || !draft.trim()} className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
