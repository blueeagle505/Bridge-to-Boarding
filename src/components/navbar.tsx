"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/become-a-mentor", label: "Become a Mentor" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardHref =
    session?.user.role === "ADMIN" ? "/admin/dashboard" : session?.user.role === "MENTOR" ? "/mentor/dashboard" : "/dashboard";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b border-foreground/8 py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <GraduationCap className="h-6 w-6" />
          Bridge to Boarding
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] font-medium text-foreground/70 transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <>
              <Link href={dashboardHref} className="text-[14px] font-medium text-foreground/70 hover:text-foreground">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/signin" className="text-[14px] font-medium text-foreground/70 hover:text-foreground">
              Sign In
            </Link>
          )}
          <Button asChild size="sm">
            <Link href="/apply">Apply</Link>
          </Button>
        </div>

        <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="glass mt-3 border-t border-foreground/8 px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-[15px] font-medium" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href={dashboardHref} className="text-[15px] font-medium" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button className="text-left text-[15px] font-medium text-destructive" onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/signin" className="text-[15px] font-medium" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            )}
            <Button asChild className="mt-2">
              <Link href="/apply" onClick={() => setOpen(false)}>Apply Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
