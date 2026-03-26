import type { Metadata } from "next";

export const SITE_NAME = "Megan Sigsworth";

export const SITE_DEFAULT_TITLE =
  "Megan Sigsworth — Shopify Technology Leader";

export const DEFAULT_DESCRIPTION =
  "Resume of Megan Sigsworth, Shopify Technology Leader: 10+ years of Shopify Plus, Liquid, performance engineering, and headless commerce across Thrive Causemetics, Birdy Grey, Datumix, Trellis, and The Good Agency.";

export const KEYWORDS_BASE = [
  "Megan Sigsworth",
  "Shopify",
  "Shopify Plus",
  "Liquid",
  "e-commerce engineer",
  "headless commerce",
  "resume"
] as const;

export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path === "/" || path === "") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildHomeMetadata(): Metadata {
  const description = DEFAULT_DESCRIPTION;
  return {
    title: { absolute: SITE_DEFAULT_TITLE },
    description,
    keywords: [...KEYWORDS_BASE],
    alternates: { canonical: "/" },
    openGraph: {
      title: SITE_DEFAULT_TITLE,
      description,
      url: absoluteUrl("/"),
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US"
    },
    twitter: {
      card: "summary",
      title: SITE_DEFAULT_TITLE,
      description
    }
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const fullOgTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    keywords: keywords?.length ? [...KEYWORDS_BASE, ...keywords] : [...KEYWORDS_BASE],
    alternates: { canonical },
    openGraph: {
      title: fullOgTitle,
      description,
      url: absoluteUrl(canonical),
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US"
    },
    twitter: {
      card: "summary",
      title: fullOgTitle,
      description
    }
  };
}

export function homeJsonLd(): Record<string, unknown> {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: SITE_DEFAULT_TITLE,
    url,
    mainEntity: {
      "@type": "Person",
      name: SITE_NAME,
      jobTitle: "Shopify Technology Leader",
      url,
      description: DEFAULT_DESCRIPTION,
      knowsAbout: [
        "Shopify Plus",
        "Liquid",
        "JavaScript",
        "e-commerce performance",
        "headless commerce"
      ]
    }
  };
}
