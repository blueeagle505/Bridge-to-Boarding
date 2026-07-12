"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="py-24">
      <div className="container grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
            Students Helping Students.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Current boarding school students volunteer their time because they remember exactly how
            overwhelming the admissions process felt — the essays, the testing, the endless questions
            about what boarding school life is actually like.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            We believe every talented student deserves access to quality admissions guidance,
            regardless of their family's income. That's why Bridge to Boarding will always be free.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { stat: "$0", label: "Cost, always" },
            { stat: "100%", label: "Student-run" },
            { stat: "3–5 days", label: "To mentor match" },
            { stat: "1:1", label: "Personal mentorship" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-foreground/8 bg-secondary/40 p-8">
              <div className="font-display text-3xl font-medium">{s.stat}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
