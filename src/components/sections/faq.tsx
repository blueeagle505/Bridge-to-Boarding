"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/lib/data/content";

export function FaqSection() {
  return (
    <section className="bg-secondary/30 py-24">
      <div className="container max-w-3xl">
        <div className="mb-14 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-5xl">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="rounded-2xl border border-foreground/8 bg-white px-6">
          {faqItems.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
