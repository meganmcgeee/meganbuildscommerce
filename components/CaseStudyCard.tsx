type CaseStudyCardProps = {
  company: string;
  problem: string;
  innovation: string;
  result: string;
};

export default function CaseStudyCard({
  company,
  problem,
  innovation,
  result
}: CaseStudyCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border bg-gradient-to-b from-background/80 to-background/40 p-5 text-sm transition hover:border-accent hover:shadow-subtle">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">{company}</h3>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
          Case Study
        </span>
      </header>
      <dl className="space-y-3 text-xs text-muted">
        <div>
          <dt className="mb-1 font-medium text-foreground">Problem</dt>
          <dd>{problem}</dd>
        </div>
        <div>
          <dt className="mb-1 font-medium text-foreground">Innovation</dt>
          <dd>{innovation}</dd>
        </div>
        <div>
          <dt className="mb-1 font-medium text-foreground">Result</dt>
          <dd>{result}</dd>
        </div>
      </dl>
    </article>
  );
}

