import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  PenLine,
  Users,
} from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { eventDateParts } from "@/lib/dates";
import { getUpcomingEvents } from "@/lib/events";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { EVENT_TYPE_LABELS, EVENT_TYPES } from "@/types/event";

const features = [
  {
    key: "post",
    icon: PenLine,
    title: "Post a service event",
    body: "A cleanup, a plantation drive, a blanket collection. Say what will be done, where to meet, and what a neighbour should bring.",
    footnote: "Published under your name",
    cta: "Create an event",
    href: "create",
  },
  {
    key: "join",
    icon: Users,
    title: "Join your neighbours",
    body: "See what is happening nearby, add your name in one click, and keep every event you have joined in a single list.",
    footnote: "One account, one record",
    cta: "Browse the register",
    href: "/events",
  },
  {
    key: "record",
    icon: Archive,
    title: "Keep the record",
    body: "Events stay on the register after the date passes, so the work a city does for itself is not forgotten by the next season.",
    footnote: "Past dates remain",
    cta: "Your joined events",
    href: "joined",
  },
] as const;

const fieldNotes = [
  {
    src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80",
    alt: "Winter coats and shirts hanging in a row",
    caption: "Winter coats, sorted by size",
    place: "Lalmatia",
    span: "lg:col-span-7",
    ratio: "aspect-[16/10]",
  },
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    alt: "Two hands holding a young sapling above dark soil",
    caption: "Saplings counted before the morning",
    place: "Dhanmondi Lake",
    span: "lg:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    alt: "Four coloured recycling bins lined up against a wall",
    caption: "Bins set out for the collection round",
    place: "Mirpur 10",
    span: "lg:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1400&q=80",
    alt: "A raised garden bed filled with young green plants",
    caption: "A bed ready for the next planting",
    place: "Rayerbazar",
    span: "lg:col-span-7",
    ratio: "aspect-[16/10]",
  },
] as const;

const heroPhoto = {
  src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
  alt: "Two hands holding a young sapling above dark soil",
};

export default async function HomePage() {
  const [session, feed] = await Promise.all([getSession(), getUpcomingEvents(6)]);
  const events = feed.ok ? feed.data : [];
  const nextEvent = events[0];
  const nextDate = nextEvent ? eventDateParts(nextEvent.eventDate) : null;

  return (
    <>
      {/* ============================== BANNER ============================== */}
      <section className="border-b border-bark">
        <Container className="py-12 md:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="font-mono text-eyebrow uppercase text-clay">
                The civic almanac · Dhaka
              </p>

              <h1 className="mt-6 max-w-[15ch] text-balance font-serif text-display text-ink">
                The city keeps a record of the people who show up.
              </h1>

              <p className="mt-7 max-w-[52ch] text-body text-ink-muted">
                Communova is a public register of community service in Dhaka.
                Create an event, join one in your neighbourhood, and leave a
                record of what was actually done.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
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
              <figure className="border border-bark bg-card">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-bark bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroPhoto.src}
                    alt={heroPhoto.alt}
                    className="size-full object-cover"
                  />
                </div>
                <figcaption className="flex items-start justify-between gap-5 px-4 py-3.5">
                  <p className="max-w-[36ch] text-[12px] leading-5 text-ink-muted">
                    Hands, soil, and a sapling — an illustrative photograph of
                    the work the register records.
                  </p>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                    Illustration · Unsplash
                  </span>
                </figcaption>
              </figure>

              {nextEvent && nextDate ? (
                <Link
                  href={`/events/${nextEvent.id}`}
                  className="group mt-4 flex items-center gap-4 border border-bark bg-sand/60 px-4 py-3.5 transition-colors hover:border-ink/35 hover:bg-sand"
                >
                  <span className="grid min-w-[46px] place-items-center border border-bark bg-paper py-1.5 text-center">
                    <span className="font-serif text-[22px] leading-none text-ink">
                      {nextDate.dayPadded}
                    </span>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                      {nextDate.month}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-clay">
                      Next on the register
                    </span>
                    <span className="mt-1 block truncate font-serif text-[19px] leading-tight text-ink">
                      {nextEvent.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-muted">
                      <MapPin className="size-3" aria-hidden />
                      <span className="truncate">{nextEvent.location}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink-muted transition-colors group-hover:text-clay"
                    aria-hidden
                  />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-12 border-t border-bark pt-5 md:mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              The register covers
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-px border border-bark bg-bark sm:grid-cols-3 lg:grid-cols-6">
              {EVENT_TYPES.map((type) => (
                <div key={type} className="bg-background px-4 py-4">
                  <dt>
                    <Tag tone={type} className="border-0 px-0 py-0">
                      {EVENT_TYPE_LABELS[type]}
                    </Tag>
                  </dt>
                  <dd className="mt-2 text-[12px] leading-5 text-ink-muted">
                    {type === "cleanup"
                      ? "Streets, parks, riverbanks"
                      : type === "plantation"
                        ? "Trees, beds, shade"
                        : type === "donation"
                          ? "Clothes, blankets, food"
                          : type === "education"
                            ? "Kits, books, tutoring"
                            : type === "health"
                              ? "Camps, check-ups, medicine"
                              : "Anything the city needs"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* ============================= FEATURES ============================= */}
      <section id="features" className="scroll-mt-24">
        <Container className="py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-eyebrow uppercase text-clay">
                What you can do
              </p>
              <h2 className="mt-5 max-w-[14ch] text-balance font-serif text-h2 text-ink">
                Small, specific, and close to home.
              </h2>
              <p className="mt-5 max-w-[40ch] text-body leading-relaxed text-ink-muted">
                Three things make the register useful: a member posts the work, a
                neighbour joins it, and the record stays put.
              </p>
              <Link
                href="/events"
                className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-clay"
              >
                Browse the register
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-bark">
                {features.map((feature) => (
                  <li
                    key={feature.key}
                    className="border-b border-bark py-6 sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6"
                  >
                    <span className="grid size-10 place-items-center border border-bark text-clay">
                      <feature.icon className="size-4" aria-hidden />
                    </span>
                    <div className="mt-4 sm:mt-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-serif text-h3 text-ink">
                          {feature.title}
                        </h3>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                          {feature.footnote}
                        </span>
                      </div>
                      <p className="mt-2 max-w-[50ch] text-small leading-relaxed text-ink-muted">
                        {feature.body}
                      </p>
                      <Link
                        href={
                          feature.href === "create"
                            ? session
                              ? "/create-event"
                              : "/register"
                            : feature.href === "joined"
                              ? session
                                ? "/joined-events"
                                : "/register"
                              : feature.href
                        }
                        className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-clay"
                      >
                        {feature.href === "create"
                          ? session
                            ? "Create an event"
                            : "Open a record"
                          : feature.href === "joined"
                            ? session
                              ? "Your joined events"
                              : "Start your record"
                            : "Browse the register"}
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================== UPCOMING EVENTS ========================= */}
      <section id="upcoming" className="scroll-mt-24 border-t border-bark">
        <Container className="py-14 md:py-20">
          <SectionHeader
            label="The register"
            title="What the city is doing next."
            description="The six nearest dates, posted by members. Past dates drop off this list and stay on the record."
            action={
              <Button asChild variant="secondary" size="sm">
                <Link href="/events">
                  All upcoming events
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            }
          />

          {feed.ok && events.length > 0 ? (
            <>
              <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                {events.length === 6
                  ? "Six nearest dates · nearest first"
                  : `${events.length} upcoming ${events.length === 1 ? "event" : "events"} · nearest first`}
              </p>
            </>
          ) : feed.ok ? (
            <div className="mt-9 border border-bark bg-card px-6 py-12 md:px-10 md:py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
                Register open · no entries yet
              </p>
              <h3 className="mt-3 max-w-[24ch] font-serif text-h2 text-ink">
                The first morning is waiting for a neighbour.
              </h3>
              <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
                When a member publishes a cleanup, plantation drive, or
                collection, it appears here with its date, place, and the person
                who posted it.
              </p>
              <Button asChild className="mt-6">
                <Link href={session ? "/create-event" : "/register"}>
                  {session ? "Create the first event" : "Open a record"}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-9 border border-bark bg-card px-6 py-12 md:px-10 md:py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
                Register resting
              </p>
              <h3 className="mt-3 max-w-[26ch] font-serif text-h2 text-ink">
                The register could not be reached just now.
              </h3>
              <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
                The events list is served by the Communova API. Reload this page,
                or open the full register in a moment.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/">
                    Reload the page
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/events">Open the register</Link>
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ============================= GALLERY ============================= */}
      <section id="gallery" className="scroll-mt-24 border-t border-bark">
        <Container className="py-14 md:py-20">
          <SectionHeader
            label="Illustrated"
            title="What the work looks like."
            description="Photographs that illustrate the kind of work the register records."
          />

          <div className="mt-9 grid gap-5 lg:grid-cols-12">
            {fieldNotes.map((note) => (
              <figure
                key={note.caption}
                className={cn("group border border-bark bg-card", note.span)}
              >
                <div
                  className={cn(
                    "relative overflow-hidden border-b border-bark bg-sand",
                    note.ratio,
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={note.src}
                    alt={note.alt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  />
                </div>
                <figcaption className="flex items-end justify-between gap-4 px-4 py-3.5">
                  <p className="text-[13px] leading-5 text-ink">{note.caption}</p>
                  <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                    {note.place}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-6 border-l-2 border-marigold pl-4 text-[12px] leading-5 text-ink-muted">
            Illustrative photography via Unsplash. Event pages carry the
            organiser&apos;s own photograph, and every event names the person who
            posted it.
          </p>
        </Container>
      </section>

      {/* ============================ NEWSLETTER ============================ */}
      <section id="newsletter" className="scroll-mt-24">
        <Container className="pb-14 md:pb-20">
          <div className="bg-canopy px-6 py-10 text-on-brand md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <p className="font-mono text-eyebrow uppercase text-marigold">
                  The dispatch
                </p>
                <h2 className="mt-5 max-w-[18ch] text-balance font-serif text-h2 text-on-brand">
                  A monthly letter from the register.
                </h2>
                <p className="mt-4 max-w-[46ch] text-body leading-relaxed text-on-brand/70">
                  What was planted, what was collected, and which mornings are
                  coming next. Written after the work, not before it.
                </p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-on-brand/40">
                  Communova · Dhaka
                </p>
              </div>

              <div className="lg:col-span-5">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
