"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus("sent");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="w-full max-w-md rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-medium">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {status === "sent" ? (
          <div className="mt-8 rounded-xl bg-secondary/60 p-6 text-sm">
            If an account exists for that email, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
