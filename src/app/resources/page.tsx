import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { resources } from "@/lib/data/content";

export const metadata: Metadata = { title: "Resources", description: "Free guides for boarding school admissions." };

const FILES: Record<string, string> = {
  "Interview Guide": "/resources/Interview-Guide.docx",
  "Essay Guide": "/resources/Essay-Guide.docx",
  "SSAT Study Plan": "/resources/SSAT-Study-Plan.docx",
  "ISEE Study Plan": "/resources/ISEE-Study-Plan.docx",
  "Packing Guide": "/resources/Packing-Guide.docx",
  "Financial Aid Guide": "/resources/Financial-Aid-Guide.docx",
  "Admissions Timeline": "/resources/Admissions-Timeline.docx",
  "Application Checklist": "/resources/Application-Checklist.docx",
};

export default function ResourcesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-3xl text-center">
        <h1 className="font-display text-5xl font-medium tracking-tight md:text-6xl">Resources</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Free guides written by mentors to help you at every stage of the process.
        </p>
      </div>

      <div className="container mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => {
          const href = FILES[r.title];
          return (
            <div key={r.title} className="flex flex-col rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{r.category}</span>
              <h3 className="mt-1 font-display text-lg font-medium">{r.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
              {href ? (
                
                  href={href}
                  download
                  className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-foreground/15 px-4 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-foreground/5"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              ) : (
                <button
                  disabled
                  className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-foreground/15 px-4 py-2 text-[13px] font-semibold text-foreground/50"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}