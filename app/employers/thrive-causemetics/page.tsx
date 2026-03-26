import Link from "next/link";
import SectionArrowLink from "@/components/SectionArrowLink";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Thrive Causemetics",
  description:
    "Megan Sigsworth at Thrive Causemetics: Shopify Plus performance, Checkout Extensibility, middleware savings, and platform migration — Senior Software Engineer experience.",
  path: "/employers/thrive-causemetics",
  keywords: [
    "Thrive Causemetics",
    "Shopify Plus",
    "Checkout Extensibility",
    "web performance",
    "headless commerce"
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
        <SectionArrowLink href={`/employers/thrive-causemetics#${anchorId}`} />
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ThriveCausemeticsPage() {
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
            Thrive Causemetics
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Senior Software Engineer (Jul 2024 – Present). Leads
            performance, extensibility, and platform decisions on a global,
            high-traffic Shopify Plus storefront.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Box
          anchorId="thrive-middleware-overage"
          title="Middleware overage remediation (~$500K)"
          bullets={[
            "Resolved middleware asset charges overage by refactoring the integration + data flow.",
            "Reduced risk of potential lost revenue by stopping incorrect asset counting/usage.",
            "Documented the decision path so ops and engineering could maintain the behavior confidently."
          ]}
        />
        <Box
          anchorId="thrive-performance-pdp"
          title="Performance initiative (~0.5s faster PDPs)"
          bullets={[
            "Cut load times by roughly 0.5 seconds on high-revenue product detail pages.",
            "Implemented structured bug triage and reporting to prevent regressions.",
            "Focused on Core Web Vitals and conversion-critical surfaces (not vanity metrics)."
          ]}
        />
        <Box
          anchorId="thrive-native-ai-migration"
          title="Platform migration to unlock native Shopify AI"
          bullets={[
            "Scoped, pitched, and authored a reversal from headless architecture toward native Shopify.",
            "Goal: reduce total cost while enabling Shopify’s native AI features and future platform launches.",
            "Project ongoing with parallel data migration tooling to minimize disruption."
          ]}
        />
        <Box
          anchorId="thrive-extensibility"
          title="Shopify extensibility: Pixel, Checkout, Discounts"
          bullets={[
            "Led Shopify Pixel implementation work aligned to modern tracking patterns.",
            "Completed Checkout Extensibility migration to reduce technical debt.",
            "Worked through Discount Functions so product and merchandising teams can ship faster."
          ]}
        />
        <Box
          anchorId="thrive-gtm-cleanup"
          title="Analytics hygiene (GTM audit + cleanup)"
          bullets={[
            "Audited, documented, and cleaned up Google Tag Manager to remove out-of-use pixels.",
            "Improved signal quality for performance work and experimentation.",
            "Built operational checklists for safe rollout + rollback."
          ]}
        />
        <Box
          anchorId="thrive-integrations-stack"
          title="Integrations (Algolia, Klaviyo, Rebuy, Rivo, Yotpo)"
          bullets={[
            "Customized integrations with key third-party services to align with the storefront architecture.",
            "Balanced build-vs-buy decisions with maintainability and team handoffs.",
            "Partnered with cross-functional teams to ensure integrations remained stable under peak demand."
          ]}
        />
      </div>
    </div>
  );
}
