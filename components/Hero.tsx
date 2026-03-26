 "use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
} as const;

export default function Hero() {
  return (
    <section className="mb-16 space-y-8">
      <motion.div
        className="max-w-3xl space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={containerVariants}
      >
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Engineering as a high-leverage growth lever
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Building the technical architecture for 9-figure brands.
        </h1>
        <p className="max-w-xl text-sm text-muted sm:text-base">
          Megan Sigsworth is a Shopify Technology Leader with 10+ years of
          experience across brand-side, agency, and Shopify app and AI teams.
          She has helped DTC brands like Thrive Causemetics, Birdy Grey, and
          Vapor95 turn metafield-driven storefronts, middleware, and
          backend systems into compounding revenue, with a bias for clean code,
          documentation, and remote-first collaboration.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="mailto:megan@meganbuildscommerce.com"
            className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background shadow-subtle transition hover:bg-accent hover:text-foreground"
          >
            Book a Strategy Session
          </a>
          <a
            href="#lab"
            className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:border-accent hover:text-foreground"
          >
            Explore The Lab
          </a>
        </div>
      </motion.div>
    </section>
  );
}

