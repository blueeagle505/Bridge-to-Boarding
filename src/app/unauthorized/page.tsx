import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      <ShieldAlert className="h-12 w-12 text-muted-foreground" />
      <h1 className="mt-6 font-display text-3xl font-medium">Access Restricted</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        You don't have permission to view this page with your current account role.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
