export default function SectionArrowLink({
  href,
  ariaLabel = "View details",
  className = ""
}: {
  href: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`group inline-flex shrink-0 items-center justify-center rounded-md p-0.5 text-accent no-underline transition-colors hover:text-foreground hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="section-arrow-icon h-4 w-4"
        aria-hidden
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
