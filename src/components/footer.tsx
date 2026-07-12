import Link from "next/link";
import { GraduationCap, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-foreground/8 bg-secondary/40">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <GraduationCap className="h-6 w-6" />
            Bridge to Boarding
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Run by boarding school students. Built for future boarding school students. Free mentorship,
            from a real current student, throughout your entire admissions journey.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="mailto:hello@bridgetoboarding.org" className="text-muted-foreground hover:text-foreground" aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Explore</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/resources" className="hover:text-foreground">Resources</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link href="/become-a-mentor" className="hover:text-foreground">Become a Mentor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold">Get Started</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/apply" className="hover:text-foreground">Apply Now</Link></li>
            <li><Link href="/signin" className="hover:text-foreground">Sign In</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-foreground/8 py-6">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Bridge to Boarding. A student-led, volunteer-run initiative.</p>
          <p>Not affiliated with, endorsed by, or sponsored by any boarding school named on this site.</p>
        </div>
      </div>
    </footer>
  );
}
