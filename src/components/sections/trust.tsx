"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Heart, Compass } from "lucide-react";
import { trustPoints } from "@/lib/data/content";

const icons = [ShieldCheck, Users, Heart, Compass];

export function TrustSection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-medium">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
