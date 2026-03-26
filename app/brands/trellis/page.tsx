import Link from "next/link";
import SectionArrowLink from "@/components/SectionArrowLink";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Trellis",
  description:
    "Megan Sigsworth as Technical Lead at Trellis: Shopify Plus for Conair Wetbrush, Kuiu, Johnny Cupcakes, West Paw, Slate Milk, Nest NY, and specialized storefronts.",
  path: "/brands/trellis",
  keywords: [
    "Trellis",
    "Shopify Plus",
    "technical lead",
    "Conair Wetbrush",
    "Kuiu",
    "Johnny Cupcakes"
  ]
});

function BrandSection({
  name,
  anchorId,
  bullets
}: {
  name: string;
  anchorId: string;
  bullets: string[];
}) {
  return (
    <section id={anchorId} className="rounded-xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-medium">{name}</h2>
        <SectionArrowLink href={`/brands/trellis#${anchorId}`} />
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

export default function TrellisBrandPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-[0.25em] text-muted hover:text-foreground"
        >
          ← Resume
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Trellis
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Technical Lead (Shopify Plus). Led a small engineering team and
            shipped enterprise storefront enhancements across multiple brands.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <BrandSection
          name="Conair Wetbrush"
          anchorId="conair-wetbrush"
          bullets={[
            "Shipped Shopify Plus storefront enhancements aligned to merchandising and campaign needs.",
            "Implemented integration patterns with common commerce tooling (search, reviews, lifecycle, promos).",
            "Improved performance and storefront stability with repeatable front-end patterns.",
            "Supported operational workflows around launches, inventory realities, and promo constraints."
          ]}
        />
        <BrandSection
          name="Kuiu"
          anchorId="kuiu"
          bullets={[
            "Delivered Shopify Plus improvements focused on high-intent PDP/PLP flows and conversion reliability.",
            "Integrated third-party services and APIs with a maintainable approach (build vs buy decisions).",
            "Hardened UX and performance for high-traffic campaigns and seasonal drops.",
            "Partnered with stakeholders to translate requirements into scoped, testable technical work."
          ]}
        />
        <BrandSection
          name="Johnny Cupcakes"
          anchorId="johnny-cupcakes"
          bullets={[
            "Optimized the storefront for high-intensity drops and peak-demand product launches.",
            "Built merchandising and PDP patterns that stayed stable under surge traffic and inventory constraints.",
            "Tightened launch QA, operational checklists, and post-release follow-through for limited releases.",
            "Balanced brand storytelling with reliable conversion paths during high-stakes release windows."
          ]}
        />
        <BrandSection
          name="West Paw & The Slow Label"
          anchorId="west-paw"
          bullets={[
            "Focused on brand storytelling and sustainability narratives through custom frontend features.",
            "Shipped theme enhancements that surfaced mission-driven content without slowing discovery or checkout.",
            "Aligned collection and PDP patterns with long-lead editorial campaigns and evergreen product education.",
            "Supported ongoing ops: content updates, promos, and cross-brand releases where timelines overlapped."
          ]}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Specialized storefronts (quick hits)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <BrandSection
            name="Slate Milk"
            anchorId="slate-milk"
            bullets={[
              "Delivered custom storefront features for a fast-growing CPG brand with heavy product-education needs.",
              "Built patterns that made formulation, benefits, and usage stories easy to scan on PDPs and landing pages.",
              "Supported iterative launches as the catalog and claims evolved with retail and DTC growth.",
              "Kept performance and maintainability in mind as content density increased."
            ]}
          />
          <BrandSection
            name="Nest NY"
            anchorId="nest-ny"
            bullets={[
              "Managed high-end fragrance UX enhancements for a luxury-minded audience.",
              "Refined PDP and collection treatments to match premium positioning and sensory storytelling.",
              "Coordinated release-ready QA around sensitive inventory, pricing, and seasonal collections."
            ]}
          />
        </div>
      </section>
    </div>
  );
}
