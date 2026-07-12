"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentorApplicationSchema, type MentorApplicationInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";

const EXPERTISE_OPTIONS = [
  "SSAT", "ISEE", "Essays", "Interviews", "School Selection", "Financial Aid", "Campus Life", "Extracurriculars",
];

export default function BecomeAMentorPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MentorApplicationInput>({ resolver: zodResolver(mentorApplicationSchema) });

  function toggleExpertise(item: string) {
    const next = expertise.includes(item) ? expertise.filter((e) => e !== item) : [...expertise, item];
    setExpertise(next);
    setValue("expertise", next);
  }

  async function onSubmit(data: MentorApplicationInput) {
    setServerError("");
    const res = await fetch("/api/mentor-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, agreedToTerms: agree }),
    });
    const result = await res.json();
    if (!res.ok) {
      setServerError(result.error || "Something went wrong.");
      return;
    }
    setSubmitted(true);
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <h1 className="font-display text-3xl font-medium">Create an account to apply as a mentor</h1>
        <div className="mt-8 flex gap-3">
          <Button asChild><Link href="/signup">Create Account</Link></Button>
          <Button asChild variant="outline"><Link href="/signin">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h1 className="mt-6 font-display text-3xl font-medium">Mentor Application Received</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Thank you for volunteering. Our team reviews every mentor application and will follow up by email.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight">Become a Mentor</h1>
        <p className="mt-3 text-muted-foreground">
          Share your experience and help a future boarding school student find their path.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6 rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={session?.user?.name ?? ""} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={session?.user?.email ?? ""} {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="school">Current School</Label>
              <Input id="school" {...register("school")} />
              {errors.school && <p className="mt-1 text-xs text-destructive">{errors.school.message}</p>}
            </div>
            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input id="graduationYear" type="number" {...register("graduationYear")} />
              {errors.graduationYear && <p className="mt-1 text-xs text-destructive">{errors.graduationYear.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="currentGrade">Current Grade</Label>
            <Input id="currentGrade" placeholder="e.g. 11th Grade" {...register("currentGrade")} />
            {errors.currentGrade && <p className="mt-1 text-xs text-destructive">{errors.currentGrade.message}</p>}
          </div>
          <div>
            <Label htmlFor="activities">Activities</Label>
            <Textarea id="activities" placeholder="Clubs, sports, arts, etc." {...register("activities")} />
            {errors.activities && <p className="mt-1 text-xs text-destructive">{errors.activities.message}</p>}
          </div>
          <div>
            <Label htmlFor="leadership">Leadership Experience</Label>
            <Textarea id="leadership" {...register("leadership")} />
            {errors.leadership && <p className="mt-1 text-xs text-destructive">{errors.leadership.message}</p>}
          </div>

          <div>
            <Label>Areas You're Comfortable Mentoring</Label>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleExpertise(item)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                    expertise.includes(item)
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/15 text-foreground/70 hover:bg-foreground/5"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {errors.expertise && <p className="mt-1 text-xs text-destructive">{errors.expertise.message as string}</p>}
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input id="availability" placeholder="e.g. Weeknights and Sunday afternoons" {...register("availability")} />
            {errors.availability && <p className="mt-1 text-xs text-destructive">{errors.availability.message}</p>}
          </div>

          <div>
            <Label htmlFor="motivation">Why do you want to mentor?</Label>
            <Textarea id="motivation" className="min-h-[140px]" {...register("motivation")} />
            {errors.motivation && <p className="mt-1 text-xs text-destructive">{errors.motivation.message}</p>}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
            <Label htmlFor="agree" className="mb-0 font-normal leading-relaxed">
              I confirm the information above is accurate and understand my application will be reviewed by the Bridge to Boarding admin team.
            </Label>
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !agree}>
            {isSubmitting ? "Submitting..." : "Submit Mentor Application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
