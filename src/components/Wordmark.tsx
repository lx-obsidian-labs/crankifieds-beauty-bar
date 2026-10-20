import Link from "next/link";

type Props = {
  light?: boolean;
  compact?: boolean;
  className?: string;
};

export function Wordmark({ light = false, compact = false, className = "" }: Props) {
  return (
    <Link
      href="/"
      aria-label="Crankified's Beauty Bar — home"
      className={`group inline-flex shrink-0 flex-col leading-none ${className}`}
    >
      <span
        className={`wordmark ${compact ? "text-[22px]" : "text-[27px]"} ${
          light ? "text-ivory" : "text-ink"
        }`}
      >
        Crankified&rsquo;s
      </span>
      <span
        className={`mt-[7px] text-[8px] uppercase tracking-[0.42em] ${
          light ? "text-ivory/55" : "text-stone"
        }`}
      >
        Beauty&nbsp;Bar&nbsp;&middot;&nbsp;Ermelo
      </span>
      <span
        aria-hidden="true"
        className="mt-2 h-px w-0 bg-[linear-gradient(90deg,var(--color-champagne),transparent)] transition-all duration-700 group-hover:w-full"
      />
    </Link>
  );
}
