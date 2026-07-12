import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about";
import { TrustSection } from "@/components/sections/trust";
import { CtaSection } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Bridge to Boarding's student-led mentorship model works.",
};

export default function AboutPage() {
  return (
    <div className="pt-32">
      <div className="container max-w-3xl text-center">
        <h1 className="font-display text-5xl font-medium tracking-tight md:text-6xl">About Bridge to Boarding</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          A free, student-led mentorship initiative helping talented students navigate boarding school admissions.
        </p>
      </div>
      <AboutSection />
      <TrustSection />
      <CtaSection />
    </div>
  );
}
