"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-foreground px-8 py-20 text-center text-background"
        >
          <h2 className="mx-auto max-w-2xl text-balance font-display text-4xl font-medium tracking-tight md:text-5xl">
            Ready to start your admissions journey?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-balance text-background/70">
            Free mentorship from a current boarding school student, from your first practice test through move-in day.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/apply">Apply Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-background/30 text-background hover:bg-background/10">
              <Link href="/become-a-mentor">Become a Mentor</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
