"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(data: SignInInput) {
    setServerError("");
    const res = await signIn("credentials", { ...data, redirect: false });

    if (res?.error === "EMAIL_NOT_VERIFIED" || res?.error?.includes("EMAIL_NOT_VERIFIED")) {
      setServerError("Please verify your email before signing in. Check your inbox for the verification link.");
      return;
    }
    if (res?.error) {
      setServerError("Incorrect email or password.");
      return;
    }
    router.push(params.get("callbackUrl") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="w-full max-w-md rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-medium">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your Bridge to Boarding account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs font-medium text-foreground/60 hover:text-foreground">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium text-foreground hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
