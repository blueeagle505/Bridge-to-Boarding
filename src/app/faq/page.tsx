import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about Bridge to Boarding." };

export default function FaqPage() {
  return (
    <div className="pt-32">
      <div className="container max-w-3xl text-center">
        <h1 className="font-display text-5xl font-medium tracking-tight md:text-6xl">FAQ</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Everything you need to know about applying, mentorship, and how Bridge to Boarding works.
        </p>
      </div>
      <FaqSection />
    </div>
  );
}
