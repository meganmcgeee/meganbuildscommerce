import Link from "next/link";
import SectionArrowLink from "@/components/SectionArrowLink";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Datumix",
  description:
    "Megan Sigsworth at Datumix: product management for a Shopify app and KPI dashboard, Cosme.net ML recommendations, Optimus.ai, and Aubrie.ai.",
  path: "/employers/datumix",
  keywords: [
    "Datumix",
    "Shopify app",
    "Cosme",
    "ML recommendations",
    "e-commerce product management"
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
        <SectionArrowLink href={`/employers/datumix#${anchorId}`} />
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

export default function DatumixPage() {
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
            Datumix
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Product Manager / Early Engineer (Jul 2018 – Jan 2020). Led global
            software + data work around Shopify app operations and ML-driven
            commerce personalization.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Box
          anchorId="datumix-shopify-app-ops"
          title="Shopify app + KPI dashboard leadership"
          bullets={[
            "First engineering hire at a Tokyo-based SaaS startup; supported the Shopify app and KPIs dashboard.",
            "Managed global software and data teams across multiple streams of work.",
            "Prioritized business needs through research and user interviews, keeping teams aligned on outcomes."
          ]}
        />
        <Box
          anchorId="datumix-cosme-recommendations"
          title="Cosme.net beauty blog recommendation engine (ML)"
          bullets={[
            "Led an ML team building an AI-driven blog and product recommendation engine for Cosme.",
            "Impact: powered customer-facing product upsells for 34.2M daily users.",
            "Designed the system around practical discovery behavior: recommendations that fit how people browse."
          ]}
        />
        <Box
          anchorId="datumix-optimus-warehouse-ai"
          title="Optimus.ai: warehouse AI intelligence"
          bullets={[
            "Applied ML/engineering to warehouse operations intelligence (Optimus.ai).",
            "Focused on turning operational signals into reliable decision support.",
            "Bridged product needs with engineering feasibility through tight scoping and iteration."
          ]}
        />
        <Box
          anchorId="datumix-aubrie-ai"
          title="Aubrie.ai (AI systems work)"
          bullets={[
            "Worked across additional AI systems under the Aubrie.ai umbrella.",
            "Partnered with product stakeholders to translate ambiguous ideas into measurable engineering tasks.",
            "Kept a consistent focus on correctness, handoffs, and maintainability."
          ]}
        />
        <Box
          anchorId="datumix-personalization"
          title="Personalization & merchandising outcomes"
          bullets={[
            "Built recommendation surfaces that made merchandisable logic usable by teams.",
            "Ensured personalization outputs were actionable, not just model scores.",
            "Supported downstream learning loops by monitoring behavior and improving feedback signals."
          ]}
        />
        <Box
          anchorId="datumix-remote-collaboration"
          title="Remote-first, cross-team collaboration"
          bullets={[
            "Comfortable working across time zones and remote teams (including offshore async collaboration).",
            "Translated research + user insights into engineering requirements with clear documentation.",
            "Ensured smooth delivery via careful handoffs and structured communication."
          ]}
        />
      </div>
    </div>
  );
}
