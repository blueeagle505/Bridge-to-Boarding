"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, GraduationCap, UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/mentors", label: "Mentors", icon: GraduationCap },
  { href: "/admin/admins", label: "Admin Users", icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen pt-20">
      <aside className="fixed bottom-0 left-0 top-20 hidden w-64 border-r border-foreground/8 bg-white lg:block">
        <nav className="flex flex-col gap-1 p-4">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-foreground text-background" : "text-foreground/70 hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 lg:pl-64">
        <div className="px-6 py-10 lg:px-12">
          <div className="flex items-center gap-2 pb-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">
            <Users className="h-3.5 w-3.5" /> Admin
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
