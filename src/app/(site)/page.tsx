import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

const features = [
  {
    index: "01",
    title: "Post a service event",
    body: "A cleanup, a plantation drive, a blanket collection. Six fields, one date, and the place it happens.",
  },
  {
    index: "02",
    title: "Join your neighbours",
    body: "See what is happening nearby, add your name, and keep every event you have joined in one list.",
  },
  {
    index: "03",
    title: "Keep the record",
    body: "Events stay on the register after the date passes, so the work a city does for itself is not forgotten.",
  },
] as const;

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <section className="border-b border-bark">
        <Container className="py-14 md:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="font-mono text-eyebrow uppercase text-clay">
                The civic almanac · Dhaka
              </p>

              <h1 className="mt-6 max-w-[15ch] text-balance font-serif text-display text-ink">
                The city keeps a record of the people who show up.
              </h1>

              <p className="mt-8 max-w-[52ch] text-body text-ink-muted">
                Communova is a public register of community service in Dhaka.
                Create an event, join one in your neighbourhood, and leave a
                record of what was actually done.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/events">
                    Browse upcoming events
                    <ArrowRight
                      className="size-4 transition-transform group-hover/button:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href={session ? "/create-event" : "/register"}>
                    {session ? "Create an event" : "Open a record"}
                  </Link>
                </Button>
              </div>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Free to join · Public to read · Built for Dhaka
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-bark bg-card">
                <div className="flex items-center justify-between gap-4 border-b border-bark px-5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    How the register works
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-clay">
                    No. 0001
                  </span>
                </div>

                <ol>
                  {features.map((feature) => (
                    <li
                      key={feature.index}
                      className="flex gap-4 border-b border-bark px-5 py-5 last:border-b-0"
                    >
                      <span className="mt-0.5 font-mono text-[10px] tracking-[0.12em] text-clay">
                        {feature.index}
                      </span>
                      <div>
                        <h2 className="text-small font-medium text-ink">{feature.title}</h2>
                        <p className="mt-1.5 text-[12px] leading-5 text-ink-muted">
                          {feature.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-4 border-l-2 border-marigold pl-4 text-[12px] leading-5 text-ink-muted">
                Every event carries the person who posted it, so the record has a
                name behind it.
              </p>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px border border-bark bg-bark sm:grid-cols-4">
            {[
              ["Event types", "06"],
              ["Private routes", "04"],
              ["Themes", "Two"],
              ["City", "Dhaka"],
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
      </section>

      <section id="features" className="scroll-mt-24">
        <Container className="py-14 md:py-20">
          <div className="border-t border-bark pt-6">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-meta text-clay">02</span>
              <span className="font-mono text-eyebrow uppercase text-ink-muted">
                What you can do
              </span>
            </div>
            <h2 className="mt-4 max-w-[22ch] text-balance font-serif text-h2 text-ink">
              Small, specific, and close to home.
            </h2>
          </div>

          <div className="mt-10 grid gap-px border border-bark bg-bark md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.index} className="bg-background p-6 md:p-7">
                <span className="font-mono text-[10px] tracking-[0.14em] text-clay">
                  {feature.index}
                </span>
                <h3 className="mt-4 font-serif text-h3 text-ink">{feature.title}</h3>
                <p className="mt-3 text-small leading-relaxed text-ink-muted">{feature.body}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            The first events appear as members publish them.
          </p>
        </Container>
      </section>
    </>
  );
}
