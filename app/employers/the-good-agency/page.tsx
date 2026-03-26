import Link from "next/link";
import SectionArrowLink from "@/components/SectionArrowLink";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "The Good Agency",
  description:
    "Megan Sigsworth at The Good Agency: Enkel Art, Rocketbook internationalization, Syna Jewels luxury launch, and Shopify Plus work for SMB and enterprise merchants.",
  path: "/employers/the-good-agency",
  keywords: [
    "The Good Agency",
    "Shopify agency",
    "Enkel Art",
    "Rocketbook",
    "Syna Jewels"
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
        <SectionArrowLink href={`/employers/the-good-agency#${anchorId}`} />
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

export default function TheGoodAgencyPage() {
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
            The Good Agency
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Co-founder / Software Engineer (Jul 2013 – Jul 2022). Tech
            lead-as-a-service; shipped MVPs and commerce solutions for Shopify
            merchants across many brands.
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Selected client work
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Box
            anchorId="project-enkel-art"
            title="Enkel Art — “Editorial” search experience (Lead Engineer)"
            bullets={[
              "Challenge: a Scandinavian art brand needed browsing that felt like a high-end gallery, not a cluttered e-commerce catalog.",
              "Custom metafield taxonomy powering filters for medium, style, size, and color.",
              "Frontend filter logic that kept an editorial, gallery-like presentation while staying as fast as a technical search tool.",
              "High-fidelity UX aligned to the brand’s minimalist aesthetic without trading away SEO or performance."
            ]}
          />
          <Box
            anchorId="project-rocketbook"
            title="Rocketbook — global expansion & internationalization (Lead Engineer)"
            bullets={[
              "Challenge: a large omnichannel brand (Best Buy, Staples) needed Shopify architecture that could serve multiple global regions at once.",
              "Multi-store management: configured and maintained internationalized Shopify stores for UK, EU, and Canada.",
              "Localization: multi-currency checkouts, localized content, and regional product availability.",
              "High-volume stability across global traffic with consistent behavior and parity across regional storefronts."
            ]}
          />
          <Box
            anchorId="project-syna-jewels"
            title="Syna Jewels — luxury greenfield launch (Lead Engineer)"
            bullets={[
              "Challenge: launching a luxury line carried at Neiman Marcus and Saks required a storefront that felt as refined as the jewelry.",
              "0-to-1 build: scoped and delivered the full Shopify storefront, including UX direction and theme architecture.",
              "Complex data modeling with deep metafields for high-value attributes (metal type, stone carat, and more) to power granular filtering.",
              "Client training: built and delivered a program so the internal team could confidently manage high-value inventory after go-live."
            ]}
          />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Box
          anchorId="agency-pivot-0to1"
          title="Pivot: landing pages to tech lead-as-a-service (0→1)"
          bullets={[
            "Bootstrapped a digital agency and pivoted into a tech lead-as-a-service model.",
            "Shipped MVPs for non-technical founders to get from 0 to 1.",
            "Delivered end-to-end outcomes using fullstack Node.js work starting around 2015."
          ]}
        />
        <Box
          anchorId="agency-shopify-plus"
          title="Commerce solutions for Shopify Plus merchants"
          bullets={[
            "Moved into building custom commerce solutions for SMB Shopify Plus merchants around 2019.",
            "Provided feature specs and best-practice guidance to keep delivery aligned with storefront goals.",
            "Focused on clean code, thorough documentation, and careful handoffs."
          ]}
        />
        <Box
          anchorId="agency-clients-top"
          title="Client portfolio highlights (sample)"
          bullets={[
            "Depth case studies: Enkel Art, Rocketbook, Syna Jewels (see above).",
            "Trellis-era and agency brands: Conair Wetbrush, Kuiu, Johnny Cupcakes, West Paw, The Slow Label.",
            "Also: Sammy Hagar Red Rocker, RoboBurger, Cameler, ACO Skincare, Slate Milk, Nest NY, and more."
          ]}
        />
        <Box
          anchorId="agency-process"
          title="Engineering process: delivery, QA, and escalations"
          bullets={[
            "Acted as escalation point for Shopify and frontend issues spanning JavaScript, HTML, and CSS.",
            "Ensured delivery by turning requirements into shippable technical specs.",
            "Maintained a steady operating model for remote and offshore async collaboration."
          ]}
        />
        <Box
          anchorId="agency-tech-stack"
          title="Core stack and delivery patterns"
          bullets={[
            "Expert level in Liquid, JavaScript, CSS frameworks, and Web Components.",
            "Experience with Tailwind-driven design systems and storefront architecture patterns.",
            "Comfortable combining backend systems with Shopify integrations (Node.js, MySQL, serverless)."
          ]}
        />
        <Box
          anchorId="agency-remote-async"
          title="Remote-first and offshore async collaboration"
          bullets={[
            "7+ years working with remote teams, including collaboration with offshore async groups.",
            "Built habits and documentation style that made async delivery reliable.",
            "Enjoyed the workflow: concise updates, careful handoffs, and predictable execution."
          ]}
        />
      </div>
    </div>
  );
}
