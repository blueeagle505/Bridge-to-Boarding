"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdminSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { UserPlus } from "lucide-react";

type FormInput = z.infer<typeof createAdminSchema>;

type Admin = { id: string; firstName: string; lastName: string; email: string; createdAt: string };

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(createAdminSchema) });

  const load = useCallback(() => {
    fetch("/api/admin/admins").then((r) => r.json()).then((d) => setAdmins(d.admins ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onSubmit(data: FormInput) {
    setServerError("");
    setSuccess(false);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      setServerError(result.error || "Something went wrong.");
      return;
    }
    setSuccess(true);
    reset();
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium tracking-tight">Admin Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage who has full administrative access.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-foreground/8 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/8 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-b border-foreground/5 last:border-0">
                  <td className="px-5 py-4 font-medium">{a.firstName} {a.lastName}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.email}</td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-display text-base font-medium">
            <UserPlus className="h-4 w-4" /> Add Administrator
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Temporary Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
            </div>
            {serverError && <p className="text-xs text-destructive">{serverError}</p>}
            {success && <p className="text-xs text-emerald-600">Administrator added.</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Administrator"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
