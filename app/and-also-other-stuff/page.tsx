import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Side projects",
  description:
    "Personal projects by Megan Sigsworth: WarmupReps+ strength calculator with Strava and Gemini, plus a Shopify Theme Snippets Library.",
  path: "/and-also-other-stuff",
  keywords: [
    "WarmupReps",
    "Strava",
    "Shopify snippets",
    "Liquid",
    "side projects"
  ]
});

type ProjectPlaceholder = {
  title: string;
  tagline: string;
  status: "idea" | "wip" | "shipped";
  tech?: string[];
};

const projects: ProjectPlaceholder[] = [
  {
    title: "WarmupReps+",
    tagline:
      "Extending the WarmupReps strength calculator to push workouts to Strava and add an LLM mode for program suggestions and rep-range reasoning.",
    status: "wip",
    tech: ["Strava API", "Gemini", "React", "Node"]
  },
  {
    title: "Shopify Theme Snippets Library",
    tagline:
      "Curated, copy-paste Liquid and section snippets for common patterns (metafield display, variant pickers, quiz entry points, offer banners).",
    status: "shipped",
    tech: ["Liquid", "Shopify", "Tailwind", "Docs"]
  }
];

const statusLabel: Record<ProjectPlaceholder["status"], string> = {
  idea: "Idea",
  wip: "In progress",
  shipped: "Shipped"
};

export default function AndAlsoOtherStuffPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-[0.25em] text-muted hover:text-foreground"
        >
          ← Megan Builds Commerce
        </Link>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
            Side projects & experiments
          </p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            And also other stuff
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Personal projects and tools—mostly strength training and Shopify
            utilities—that I tinker with when not building storefronts.
          </p>
        </div>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <li key={index}>
            <article className="flex h-full flex-col rounded-2xl border border-border bg-gradient-to-b from-background/80 to-background/40 p-5 transition hover:border-accent/50">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-foreground">
                  {project.title}
                </h2>
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                  {statusLabel[project.status]}
                </span>
              </div>
              <p className="flex-1 text-xs leading-relaxed text-muted">
                {project.tagline}
              </p>
              {project.tech && project.tech.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-muted">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded bg-border/60 px-1.5 py-0.5 font-medium"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
