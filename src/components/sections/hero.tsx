"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="gradient-hero relative flex min-h-screen items-center overflow-hidden pt-24">
      <motion.div style={{ y, scale }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-indigo-200/30 blur-3xl" />
      </motion.div>

      <motion.div style={{ opacity }} className="container relative z-10 py-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-block rounded-full border border-foreground/10 bg-white/70 px-4 py-1.5 text-[13px] font-medium text-foreground/70"
        >
          Run by Boarding School Students. Built for Future Boarding School Students.
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto max-w-4xl text-balance font-display text-6xl font-medium tracking-tight md:text-8xl"
        >
          Your Future Starts Here.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl"
        >
          Bridge to Boarding connects prospective boarding school applicants with current boarding
          school students who provide free mentorship throughout the admissions process.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/apply">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/become-a-mentor">Become a Mentor</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
