"use client";

import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { featuredSchools } from "@/lib/data/content";

export function FeaturedSchools() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-5xl">Featured Schools</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A sample of the boarding schools our applicants apply to. Shown for informational purposes only.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSchools.map((school, i) => (
            <motion.div
              key={school.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              className="overflow-hidden rounded-2xl border border-foreground/8 bg-white shadow-sm"
            >
              <div
                className="h-40 w-full bg-gradient-to-br from-slate-200 via-slate-100 to-white"
                role="img"
                aria-label={`Placeholder campus image for ${school.name}`}
              />
              <div className="p-6">
                <h3 className="font-display text-lg font-medium">{school.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{school.desc}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{school.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{school.enrollment}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          Bridge to Boarding is independent and is not affiliated with, endorsed by, or sponsored by any
          of the schools listed above. School names and logos are the property of their respective institutions.
        </p>
      </div>
    </section>
  );
}
