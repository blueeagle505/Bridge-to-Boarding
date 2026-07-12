"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";

type Analytics = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  waitlisted: number;
  mentors: number;
  avgReviewDays: number;
  recentApplications: { id: string; firstName: string; lastName: string; status: string; updatedAt: string }[];
  byState: { state: string; count: number }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics").then((r) => r.json()).then(setData);
  }, []);

  const cards = data
    ? [
        { label: "Total Applications", value: data.total },
        { label: "Pending Review", value: data.pending },
        { label: "Mentors Matched", value: data.approved },
        { label: "Waitlisted", value: data.waitlisted },
        { label: "Not Selected", value: data.rejected },
        { label: "Active Mentors", value: data.mentors },
        { label: "Avg. Review Time", value: `${data.avgReviewDays ?? 0}d` },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-medium tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">An overview of applications, mentors, and activity.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
            <div className="text-2xl font-semibold">{c.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>

      {data && data.byState.length > 0 && (
        <div className="mt-8 rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-medium">Applications by State</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byState}>
                <XAxis dataKey="state" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data && (
        <div className="mt-8 rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">Recent Activity</h2>
            <Link href="/admin/applications" className="text-xs font-medium text-accent hover:underline">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-foreground/8">
            {data.recentApplications.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium">{a.firstName} {a.lastName}</span>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[a.status]}`}>
                    {STATUS_LABELS[a.status]}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(a.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
