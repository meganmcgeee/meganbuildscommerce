import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DEFAULT_DESCRIPTION,
  getMetadataBase,
  SITE_DEFAULT_TITLE,
  SITE_NAME
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: "/" }],
  creator: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/favicon.ico"
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US"
  },
  twitter: {
    card: "summary"
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                Megan Sigsworth
              </span>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-border pt-6 text-xs text-muted">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <span>© {new Date().getFullYear()} Megan Builds Commerce.</span>
              <div className="flex gap-4">
                <a
                  href="mailto:megan@meganbuildscommerce.com"
                  className="hover:text-foreground"
                >
                  Email
                </a>
                <a
                  href="https://www.linkedin.com"
                  className="hover:text-foreground"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
