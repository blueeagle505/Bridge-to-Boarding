"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming",
];

export default function ApplyPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [agree, setAgree] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: session?.user?.name?.split(" ")[0] ?? "",
      email: session?.user?.email ?? "",
    },
  });

  useEffect(() => {
    setValue("agreedToTerms", agree as true);
  }, [agree, setValue]);

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <h1 className="font-display text-3xl font-medium">Create an account to apply</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Every applicant needs a verified account so we can keep your application secure and keep you updated.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild><Link href="/signup">Create Account</Link></Button>
          <Button asChild variant="outline"><Link href="/signin">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  async function onSubmit(data: ApplicationInput) {
    setServerError("");
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      setServerError(result.error || "Something went wrong.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => router.push("/dashboard"), 1800);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h1 className="mt-6 font-display text-3xl font-medium">Application Received</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Thank you for applying. Our volunteer admissions team reviews every application. If accepted,
          you should expect to be matched with a mentor within approximately 3–5 business days.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight">Apply for Mentorship</h1>
        <p className="mt-3 text-muted-foreground">
          This should take about 5 minutes. Tell us a bit about yourself and what you need help with.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6 rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="currentSchool">Current School</Label>
            <Input id="currentSchool" {...register("currentSchool")} />
            {errors.currentSchool && <p className="mt-1 text-xs text-destructive">{errors.currentSchool.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select id="state" {...register("state")} defaultValue="">
                <option value="" disabled>Select your state</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state.message}</p>}
            </div>
            <div>
              <Label htmlFor="currentGrade">Current Grade</Label>
              <Select id="currentGrade" {...register("currentGrade")} defaultValue="">
                <option value="" disabled>Select your grade</option>
                <option value="GRADE_7">7th Grade</option>
                <option value="GRADE_8">8th Grade</option>
              </Select>
              {errors.currentGrade && <p className="mt-1 text-xs text-destructive">{errors.currentGrade.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="gpa">Current GPA</Label>
            <Input id="gpa" placeholder="e.g. 3.8" {...register("gpa")} />
            {errors.gpa && <p className="mt-1 text-xs text-destructive">{errors.gpa.message}</p>}
          </div>

          <div>
            <Label htmlFor="helpNeeded">What do you need help with?</Label>
            <Textarea
              id="helpNeeded"
              placeholder="Tell us about your goals — essays, SSAT/ISEE, school selection, interviews, financial aid, or anything else."
              className="min-h-[180px]"
              {...register("helpNeeded")}
            />
            {errors.helpNeeded && <p className="mt-1 text-xs text-destructive">{errors.helpNeeded.message}</p>}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
            <Label htmlFor="agree" className="mb-0 font-normal leading-relaxed">
              I confirm the information above is accurate and I agree to be contacted by Bridge to
              Boarding mentors and staff regarding my application.
            </Label>
          </div>
          {errors.agreedToTerms && <p className="text-xs text-destructive">{errors.agreedToTerms.message}</p>}

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
