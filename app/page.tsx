import Link from "next/link";
import SectionArrowLink from "@/components/SectionArrowLink";
import { buildHomeMetadata, homeJsonLd } from "@/lib/seo";

export const metadata = buildHomeMetadata();

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd())
        }}
      />
      <div className="space-y-10">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Megan Sigsworth
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">
            Shopify Technology Leader
          </p>
          <p className="max-w-3xl text-sm text-muted">
            Career software engineer specializing in Shopify Plus and Node.js with
            10+ years across brand-side, agency, and Shopify app/AI teams.
            Expertise includes Liquid, JavaScript, CSS, Tailwind, GraphQL,
            middleware engineering, and backend systems connected to Shopify.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Key Competencies</h2>
          <p className="text-sm text-muted">
            JavaScript, Node.js, React, Vue, Web Components, Tailwind, Liquid,
            Shopify Plus, Checkout Extensions, GraphQL, Google Cloud Functions,
            Django, MySQL, SEO, Core Web Vitals, SpeedCurve, internationalized
            storefronts.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Professional Experience</h2>
          <p className="text-sm text-muted">
            Trellis client brand work:{" "}
            <Link href="/brands/trellis" className="hover:text-foreground">
              view details
            </Link>
            .
          </p>
          <div className="space-y-5 text-sm">
            <article
              id="thrive-causemetics"
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">
                  Thrive Causemetics, Inc. — Senior Software Engineer
                </h3>
                <SectionArrowLink href="/employers/thrive-causemetics" />
              </div>
              <p className="text-xs text-muted">Jul 2024 – Present</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                <li>
                  Resolved middleware asset overage and saved roughly $500K in
                  potential loss.
                </li>
                <li>Cut load times by ~0.5s on high-revenue PDPs.</li>
                <li>
                  Leading platform migration to native Shopify for lower cost and
                  AI capabilities.
                </li>
              </ul>
            </article>

            <article id="birdy-grey" className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">Birdy Grey — Senior Software Engineer</h3>
                <SectionArrowLink href="/employers/birdy-grey" />
              </div>
              <p className="text-xs text-muted">Jul 2022 – Jul 2024</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                <li>
                  First in-house engineering hire; owned storefront architecture and
                  SDLC rollout.
                </li>
                <li>
                  Built made-to-order system with metafield messaging across PLP, PDP,
                  cart, and checkout.
                </li>
                <li>
                  Routed order data to Fulfil.io and built headless shipping updates
                  via Aftership flows.
                </li>
                <li>
                  Work coincided with revenue growth from roughly $80M to $180M.
                </li>
              </ul>
            </article>

            <article id="trellis" className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">Trellis — Technical Lead</h3>
                <SectionArrowLink href="/brands/trellis" />
              </div>
              <p className="text-xs text-muted">Sep 2021 – Jul 2022</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                <li>
                  Led a team of 4 engineers while shipping Shopify Plus enhancements
                  for enterprise D2C clients.
                </li>
                <li>
                  Built integrations across Recharge, Rebuy, Yotpo, and Swell Rewards
                  ecosystems.
                </li>
              </ul>
            </article>

            <article id="datumix" className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">
                  Datumix, Inc. — Product Manager / Early Engineer
                </h3>
                <SectionArrowLink href="/employers/datumix" />
              </div>
              <p className="text-xs text-muted">Jul 2018 – Jan 2020</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                <li>
                  Managed global software and data teams for a Shopify app and KPI
                  dashboard.
                </li>
                <li>
                  Led an ML team developing an AI-driven blog and product
                  recommendation engine for Cosme’s blog, impacting 34.2
                  million daily users and powering customer-facing product
                  upsells.
                </li>
              </ul>
            </article>

            <article id="the-good-agency" className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">
                  The Good Agency — Co-founder / Software Engineer
                </h3>
                <SectionArrowLink href="/employers/the-good-agency" />
              </div>
              <p className="text-xs text-muted">Jul 2013 – Jul 2022</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                <li>
                  Lead Engineer on standout builds including Enkel Art (editorial
                  gallery search), Rocketbook (multi-region Shopify + localization),
                  and Syna Jewels (luxury 0-to-1 launch with deep metafields and
                  client training).
                </li>
                <li>
                  Broader portfolio across Trellis-era and agency work: Conair
                  Wetbrush, Kuiu, Johnny Cupcakes, West Paw, The Slow Label, Slate
                  Milk, Nest NY, Sammy Hagar Red Rocker, RoboBurger, Cameler,
                  Syna Jewels, and more.
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Education</h2>
          <p className="text-sm text-muted">
            Bachelor of Arts, Experimental Psychology — Marymount Manhattan College
            (Sep 2008 – May 2012)
          </p>
        </section>
      </div>
    </>
  );
}
