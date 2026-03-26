import Link from "next/link";
import SectionArrowLink from "@/components/SectionArrowLink";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Birdy Grey",
  description:
    "Megan Sigsworth at Birdy Grey: first in-house engineer, made-to-order metafields, ERP routing, Aftership, and storefront modernization on Shopify Plus.",
  path: "/employers/birdy-grey",
  keywords: [
    "Birdy Grey",
    "Shopify Plus",
    "made to order",
    "metafields",
    "Aftership"
  ]
});

function Box({
  anchorId,
  title,
  bullets
}: {
  anchorId: string;
  title: string;
  bullets: string[];
}) {
  return (
    <section id={anchorId} className="rounded-xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-medium">{title}</h2>
        <SectionArrowLink href={`/employers/birdy-grey#${anchorId}`} />
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

export default function BirdyGreyPage() {
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
            Birdy Grey
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Senior Software Engineer (Jul 2022 – Jul 2024). First in-house
            engineering hire; owned storefront architecture and shipped
            made-to-order + ops-driven experiences.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Box
          anchorId="birdy-made-to-order-metafields"
          title="Made-to-order system (metafields across PLP/PDP/cart/checkout)"
          bullets={[
            "Built made-to-order logic using Shopify metafields to message at each storefront stage.",
            "Coordinated PLP/PDP/cart/checkout experiences so customers understood timelines and requirements upfront.",
            "Designed for maintainability so ops and retention teams could iterate without fragile hacks."
          ]}
        />
        <Box
          anchorId="birdy-erp-routing"
          title="Order routing to ERP + correct facility"
          bullets={[
            "Routed order data to the correct downstream system so production could be directed to the right warehouse/facility.",
            "Collaborated with ops teams to validate edge cases (sku/timeline/fulfillment constraints).",
            "Ensured the architecture supported operational reality, not just ideal flows."
          ]}
        />
        <Box
          anchorId="birdy-aftership-tracking"
          title="Amazon-style tracking (Aftership + custom emails)"
          bullets={[
            "Delivered an order tracking experience via Aftership tracking integration.",
            "Built custom email flows with timeline context, including cut/sewn vs ready-to-ship messaging.",
            "Coordinated with retention teams to keep customer-facing communication clear and accurate."
          ]}
        />
        <Box
          anchorId="birdy-timeline-messaging"
          title="Timeline messaging with ops + retention"
          bullets={[
            "Partnered with operations and retention teams on complex timeline messaging requirements.",
            "Turned workflow constraints into customer-friendly messaging rules.",
            "Improved consistency across notifications and storefront surfaces."
          ]}
        />
        <Box
          anchorId="birdy-sdlc-migration"
          title="Architecture ownership + SDLC + migrations"
          bullets={[
            "Owned custom Liquid storefront architecture supporting eight-figure revenue.",
            "Led migration from legacy JS/CSS frameworks to modern patterns for scalability and stability.",
            "Introduced SDLC processes: version control, release rotations, code review, sprint retrospectives."
          ]}
        />
        <Box
          anchorId="birdy-speed-accessibility"
          title="Speed, conversion, and ADA compliance improvements"
          bullets={[
            "Optimized site speed with ~10% page load time reduction, supporting conversion lift (~0.5%).",
            "Improved ADA compliance for stricter accessibility requirements.",
            "Maintained focus on performance and usability during feature delivery."
          ]}
        />
      </div>
    </div>
  );
}
