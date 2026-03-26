const logos = [
  "Thrive Causemetics",
  "Birdy Grey",
  "Conair",
  "KUIU",
  "Johnny Cupcakes",
  "RoboBurger"
];

export default function LogoMarquee() {
  return (
    <section
      aria-label="Brands Megan has partnered with"
      className="mb-16 border-y border-border py-6"
    >
      <div className="flex items-center justify-between gap-4 text-xs text-muted">
        <span className="whitespace-nowrap font-medium uppercase tracking-[0.2em]">
          Trusted by
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
          <div className="flex min-w-max marquee gap-10 pr-10">
            {logos.concat(logos).map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="whitespace-nowrap text-xs uppercase tracking-[0.2em] text-foreground/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

