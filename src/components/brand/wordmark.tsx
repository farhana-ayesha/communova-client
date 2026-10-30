import { cn } from "@/lib/utils";

/**
 * Communova monogram: six participants around a table, one in accent.
 * Composition beats decoration — no leaf, heart, or handshake.
 */
function Monogram({ className }: { className?: string }) {
  const dots = [
    [16, 6.5],
    [24.23, 11.25],
    [24.23, 20.75],
    [16, 25.5],
    [7.77, 20.75],
    [7.77, 11.25],
  ] as const;

  return (
    <svg viewBox="0 0 32 32" aria-hidden fill="none" className={cn("size-8", className)}>
      {dots.map(([cx, cy], index) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={index === 0 ? 2.6 : 1.9}
          fill={index === 0 ? "var(--ember)" : "currentColor"}
        />
      ))}
    </svg>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-serif tracking-[-0.02em] text-ink", className)}>
      Communova
    </span>
  );
}

export { Monogram, Wordmark };
