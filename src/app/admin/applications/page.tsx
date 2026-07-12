"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";

type Row = {
  id: string;
  firstName: string;
  lastName: string;
  currentSchool: string;
  currentGrade: string;
  state: string;
  gpa: string;
  status: string;
  createdAt: string;
  mentor: { user: { firstName: string; lastName: string } } | null;
};

const STATUSES = ["ALL", "DRAFT", "SUBMITTED", "UNDER_REVIEW", "MENTOR_ASSIGNED", "WAITLISTED", "REJECTED", "CLOSED"];

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status !== "ALL") params.set("status", status);
    fetch(`/api/admin/applications?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setRows(d.applications ?? []))
      .finally(() => setLoading(false));
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div>
      <h1 className="font-display text-3xl font-medium tracking-tight">Applications</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, email, or school..." className="pl-11" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56">
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Statuses" : STATUS_LABELS[s]}</option>
          ))}
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-foreground/8 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/8 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Applicant</th>
              <th className="px-5 py-3 font-medium">School</th>
              <th className="px-5 py-3 font-medium">Grade</th>
              <th className="px-5 py-3 font-medium">State</th>
              <th className="px-5 py-3 font-medium">GPA</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No applications found.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-foreground/5 last:border-0 hover:bg-secondary/30">
                  <td className="px-5 py-4">
                    <Link href={`/admin/applications/${r.id}`} className="font-medium hover:underline">
                      {r.firstName} {r.lastName}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{r.currentSchool}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.currentGrade === "GRADE_7" ? "7th" : "8th"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.state}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.gpa}</td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(r.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
