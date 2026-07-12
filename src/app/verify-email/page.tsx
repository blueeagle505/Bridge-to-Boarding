"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed.");
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="w-full max-w-md rounded-2xl border border-foreground/8 bg-white p-10 text-center shadow-sm">
        {status === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />}
        {status === "success" && <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />}
        {status === "error" && <XCircle className="mx-auto h-10 w-10 text-destructive" />}

        <h1 className="mt-6 font-display text-xl font-medium">
          {status === "loading" ? "Verifying..." : status === "success" ? "Email Verified" : "Verification Failed"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>

        {status !== "loading" && (
          <Button asChild className="mt-8 w-full">
            <Link href="/signin">Go to Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
