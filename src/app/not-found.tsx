import Link from "next/link";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { NotFoundRecord } from "@/components/layout/not-found-record";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Standalone 404 for addresses outside the public site group (for example a
 * mistyped auth route). It supplies its own header because no site shell wraps
 * it; the site group uses `(site)/not-found.tsx` instead.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-bark">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Communova home">
            <Monogram className="size-6 text-ink" />
            <Wordmark className="text-[22px]" />
          </Link>
          <ThemeToggle />
        </Container>
      </header>

      <main className="flex flex-1 items-center">
        <Container className="py-16 md:py-24">
          <NotFoundRecord />
        </Container>
      </main>

      <footer className="border-t border-bark">
        <Container className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Communova · Dhaka
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Every event is a record
          </p>
        </Container>
      </footer>
    </div>
  );
}
