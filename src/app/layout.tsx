import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500", "600"] });

const siteUrl = process.env.NEXTAUTH_URL || "https://bridgetoboarding.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bridge to Boarding — Free Boarding School Admissions Mentorship",
    template: "%s | Bridge to Boarding",
  },
  description:
    "Bridge to Boarding connects prospective boarding school applicants with current boarding school students who provide free mentorship throughout the admissions process.",
  keywords: [
    "boarding school admissions",
    "boarding school mentorship",
    "SSAT prep",
    "ISEE prep",
    "free admissions consulting",
    "boarding school application help",
  ],
  authors: [{ name: "Bridge to Boarding" }],
  openGraph: {
    title: "Bridge to Boarding — Free Boarding School Admissions Mentorship",
    description:
      "Run by boarding school students. Built for future boarding school students. Free mentorship, from a real current student, throughout your entire admissions journey.",
    url: siteUrl,
    siteName: "Bridge to Boarding",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bridge to Boarding — Free Boarding School Admissions Mentorship",
    description:
      "Free, student-led mentorship for boarding school applicants — essays, SSAT/ISEE, interviews, school selection, and more.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
