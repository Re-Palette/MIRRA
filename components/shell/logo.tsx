import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-sans font-light uppercase tracking-logo [margin-right:-0.42em]", className)}>
      Mirra
    </span>
  );
}

/** Thin calligraphic "M" monogram. */
export function Monogram({ className, strokeWidth = 1.1 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden>
      <path
        d="M5 41c3.5-5 7.4-15.8 10.6-26.6 1-3.3 2.1-6.2 3.2-7.9.4 7.3.8 17.6 1.8 26.4 3.9-9.8 9.6-20.2 15.8-26.6-.8 9.6-1.4 21.9.2 30.9.4 2.3 1.4 3.9 3.4 4.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.5 30.5c6-1.2 13.6-1.4 19.5-.2" stroke="currentColor" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity={0.55} />
    </svg>
  );
}
