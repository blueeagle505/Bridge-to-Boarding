"use client";

import { motion } from "framer-motion";
import {
  BookOpen, PenTool, MessageSquare, Compass, ClipboardList, HandCoins,
  Building2, BedDouble, Trophy, Users2, CalendarClock, GraduationCap,
} from "lucide-react";
import { helpTopics } from "@/lib/data/content";

const icons = [
  BookOpen, GraduationCap, PenTool, MessageSquare, Compass, ClipboardList,
  HandCoins, Building2, BedDouble, Trophy, Users2, CalendarClock,
];

export function HelpGrid() {
  return (
    <section className="bg-secondary/30 py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-5xl">What We Help With</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Support across every part of the admissions process — from the first practice test to move-in day.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {helpTopics.map((topic, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                className="rounded-2xl border border-foreground/8 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 text-[15px] font-semibold">{topic.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{topic.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
