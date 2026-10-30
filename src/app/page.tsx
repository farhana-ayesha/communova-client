import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 items-center">
      <Container className="py-24 md:py-32">
        <p className="font-mono text-eyebrow uppercase text-clay">
          The civic almanac · Dhaka
        </p>

        <h1 className="mt-6 max-w-[16ch] text-balance font-serif text-display text-ink">
          The city keeps a record of the people who show up.
        </h1>

        <p className="mt-8 max-w-[52ch] text-body text-ink-muted">
          Communova is being built in phases. The identity, colour system, and
          component language are in place; the homepage, events, and membership
          follow next.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/styleguide">
              Open the design system
              <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/styleguide#components">See the components</Link>
          </Button>
        </div>

        <dl className="mt-16 grid max-w-[640px] grid-cols-2 gap-px border border-bark bg-bark sm:grid-cols-4">
          {[
            ["Phase", "00"],
            ["Typefaces", "03"],
            ["Colour tokens", "10"],
            ["Next", "Homepage"],
          ].map(([label, value]) => (
            <div key={label} className="bg-background px-4 py-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                {label}
              </dt>
              <dd className="mt-2 font-serif text-h3 text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </main>
  );
}
