import CaseStudyCard from "./CaseStudyCard";

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="mb-20 space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Proof of Work
        </p>
        <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
          Turning architectural bets into compounding revenue.
        </h2>
        <p className="max-w-2xl text-xs text-muted sm:text-sm">
          Selected Shopify Plus engagements where rethinking Liquid, metafields,
          middleware, and data products created new growth surfaces for
          eight- and nine-figure brands.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <CaseStudyCard
          company="Birdy Grey"
          problem="A fast-growing, eight-figure bridal brand needed to introduce a made-to-order program without breaking customer trust or operational flow."
          innovation="Used Shopify metafields to orchestrate messaging across PLP, PDP, cart, and checkout while routing orders into the right warehouses and ERP states."
          result="Enabled a new segment of made-to-order business and contributed to revenue growth from roughly $80M to $180M while maintaining a high-touch experience."
        />
        <CaseStudyCard
          company="Thrive Causemetics"
          problem="A global, high-traffic beauty brand was overspending on middleware assets and leaving conversion on the table due to performance bottlenecks."
          innovation="Remediated a middleware asset overage, led a performance initiative on high-revenue PDPs, and paved the path for a platform migration to unlock Shopify-native AI."
          result="Avoided ~$500K in potential overage charges and cut PDP load times by roughly 0.5 seconds, directly improving revenue and experimentation velocity."
        />
        <CaseStudyCard
          company="Datumix"
          problem="Retailers had rich behavioral data but lacked a practical way to turn it into upsells and recommendations inside their commerce experiences."
          innovation="Led product for a Shopify app and KPI dashboard while managing an ML team building an AI-driven recommendation engine for Cosme’s 34.2M daily users."
          result="Turned experimental ML work into production-grade recommendation surfaces that powered upsells and informed product merchandising."
        />
        <CaseStudyCard
          company="Sammy Hagar Red Rocker"
          problem="A multi-brand celebrity Shopify storefront needed a clear merchandising story across product lines, tours, and drops while keeping day-to-day ops and fulfillment partners aligned."
          innovation="Built and refined the Shopify theme and IA for a celebrity-led, multi-brand experience—translating merchandising strategy into PLP/PDP structure, collections, and launch workflows with hands-on ops support for drops and inventory reality."
          result="A storefront that supports multiple brands and moments under one roof, with merchandising and operations that stay in sync when campaigns, SKUs, and fulfillment needs change."
        />
      </div>
    </section>
  );
}

