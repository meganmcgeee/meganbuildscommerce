import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: `The requested page is not part of ${SITE_NAME}'s resume site.`,
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm text-muted">
        That URL does not exist. Try the{" "}
        <Link href="/" className="text-accent hover:text-foreground">
          home page
        </Link>
        .
      </p>
    </div>
  );
}
