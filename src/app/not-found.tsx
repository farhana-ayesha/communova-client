import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

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
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="font-mono text-eyebrow uppercase text-clay">Record not found</p>
              <h1 className="mt-5 max-w-[18ch] text-balance font-serif text-h1 text-ink">
                This page is missing from the almanac.
              </h1>
              <p className="mt-5 max-w-[48ch] text-body text-ink-muted">
                The address you followed does not match an entry. The register is
                public, so start from the events list or return to the front page.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/events">
                    Browse upcoming events
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/">
                    <ArrowLeft className="size-4" aria-hidden />
                    Back to the almanac
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-bark bg-card">
                <div className="flex items-center justify-between border-b border-bark px-5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    Register entry
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-clay">
                    Error 404
                  </span>
                </div>
                <div className="px-5 py-10">
                  <p className="font-serif text-[clamp(4rem,10vw,7rem)] leading-none tracking-[-0.03em] text-ink">
                    404
                  </p>
                  <p className="mt-5 font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-ink-muted">
                    No event, page, or member record exists at this address.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
