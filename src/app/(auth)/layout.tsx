import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Authentication shell. The left panel is typographic rather than photographic:
 * the photography direction is still being curated, and a strong sentence does
 * more for the brand than a generic stock image.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-canopy px-5 py-8 text-on-brand md:px-10 md:py-10 lg:px-14 lg:py-12">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="Communova home">
            <Monogram className="size-7 text-on-brand" />
            <Wordmark className="text-xl text-on-brand" />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-on-brand/60">
            Dhaka · 2026
          </span>
        </div>

        <div className="mt-14 max-w-[30ch] lg:mt-0">
          <p className="font-mono text-eyebrow uppercase text-marigold">The civic almanac</p>
          <p className="mt-5 text-balance font-serif text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] tracking-[-0.02em]">
            The city keeps a record of the people who show up.
          </p>
          <p className="mt-6 hidden max-w-[42ch] text-small leading-relaxed text-on-brand/70 lg:block">
            Not a feed. A register of cleanups, plantation drives, blanket collections,
            and the neighbours who turn up for them.
          </p>
        </div>

        <ol className="mt-14 hidden gap-px border-t border-on-brand/15 pt-6 sm:grid-cols-3 lg:mt-0 lg:grid">
          {[
            ["01", "Create a service event"],
            ["02", "Join your neighbours"],
            ["03", "Keep the record"],
          ].map(([index, label]) => (
            <li key={index} className="flex gap-2.5 py-2 sm:py-0">
              <span className="font-mono text-[10px] tracking-[0.12em] text-marigold">{index}</span>
              <span className="text-[12px] leading-5 text-on-brand/75">{label}</span>
            </li>
          ))}
        </ol>
      </aside>

      <main className="flex min-w-0 flex-col bg-background">
        <div className="flex items-center justify-between gap-4 border-b border-bark px-5 py-3 md:px-10 lg:justify-end lg:border-b-0 lg:pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-small text-ink-muted transition-colors hover:text-ink lg:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to the site
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="hidden px-3 text-small text-ink-muted transition-colors hover:text-ink lg:inline"
            >
              Back to the site
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center px-5 py-10 md:px-10 lg:items-center lg:px-14 lg:py-14">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>

        <div className="px-5 pb-6 md:px-10 lg:px-14">
          <p className="border-t border-bark pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Communova · a public record of service in Dhaka
          </p>
        </div>
      </main>
    </div>
  );
}
