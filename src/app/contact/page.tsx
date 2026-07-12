"use client";

import { useState } from "react";
import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container grid max-w-5xl gap-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl font-medium tracking-tight">Contact Us</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Questions about applying, mentorship, or partnering with us? We'd love to hear from you.
          </p>
          <div className="mt-10 space-y-4">
            <a href="mailto:hello@bridgetoboarding.org" className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground">
              <Mail className="h-5 w-5" /> hello@bridgetoboarding.org
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground">
              <Instagram className="h-5 w-5" /> @bridgetoboarding
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
          {status === "success" ? (
            <div className="py-10 text-center">
              <h3 className="font-display text-xl font-medium">Message sent</h3>
              <p className="mt-2 text-sm text-muted-foreground">Thanks for reaching out — we'll be in touch soon.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Message"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
