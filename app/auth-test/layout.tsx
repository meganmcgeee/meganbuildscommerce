import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "API credential check",
  description:
    "Internal tool page to verify Gemini and Shopify API credentials. Not intended for public indexing.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  },
  openGraph: {
    title: `API credential check | ${SITE_NAME}`,
    description: "Developer-only credential verification page."
  }
};

export default function AuthTestLayout({ children }: { children: ReactNode }) {
  return children;
}
