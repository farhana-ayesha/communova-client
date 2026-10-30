import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/events/event-card";
import { JoinPanel } from "@/components/events/join-panel";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Avatar } from "@/components/user/avatar";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { eventDateParts, isPastEvent } from "@/lib/dates";
import { getEventView, getUpcomingEvents } from "@/lib/events";
import { getApiToken } from "@/lib/server-token";
import { getSession } from "@/lib/session";
import { EVENT_TYPE_LABELS } from "@/types/event";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const feed = await getEventView(id);

  if (!feed.ok) {
    return {
      title: "Event record",
      description: "A community service event on the Communova register.",
    };
  }

  const { event } = feed.data;

  return {
    title: event.title,
    description: event.description.slice(0, 155),
  };
}

function UnavailableRegister() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-[620px] border border-bark bg-card px-6 py-12 md:px-10 md:py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
          Record unavailable
        </p>
        <h1 className="mt-3 font-serif text-h1 text-ink">
          This record could not be opened.
        </h1>
        <p className="mt-4 max-w-[48ch] text-small leading-relaxed text-ink-muted">
          The events service is not answering right now. The rest of the site
          still works; try the register again in a moment.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/events">
              Back to the register
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">The almanac</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  const token = session ? await getApiToken() : null;

  const [feed, moreFeed] = await Promise.all([
    getEventView(id, token),
    getUpcomingEvents(4, token),
  ]);

  if (!feed.ok) {
    if (feed.reason === "not_found") notFound();
    return <UnavailableRegister />;
  }

  const { event, viewerHasJoined } = feed.data;
  const date = eventDateParts(event.eventDate);
  const posted = eventDateParts(event.createdAt);
  const past = isPastEvent(event.eventDate);
  const related = moreFeed.ok
    ? moreFeed.data.filter((candidate) => candidate.id !== event.id).slice(0, 3)
    : [];

  return (
    <>
      <Container className="py-8 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bark pt-5">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            The register
          </Link>
          <Tag tone={past ? "past" : "upcoming"}>
            {past ? "Past event" : "Upcoming"}
          </Tag>
        </div>

        <div className="mt-6">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            <span className="text-clay">{EVENT_TYPE_LABELS[event.type]}</span>
            <span aria-hidden>·</span>
            <span>{date?.short ?? "Date to be confirmed"}</span>
          </p>
          <h1 className="mt-4 max-w-[20ch] text-balance font-serif text-h1 text-ink">
            {event.title}
          </h1>
        </div>

        <figure className="mt-8 border border-bark bg-sand">
          <div className="aspect-[16/9] max-h-[520px] overflow-hidden md:aspect-[21/9]">
            {/* Thumbnails are member-supplied, so they stay plain `<img>` elements. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.thumbnailUrl}
              alt={`${event.title} — event photograph`}
              className="size-full object-cover"
            />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-bark bg-paper px-4 py-2.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
              {event.location}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
              Communova · Dhaka
            </span>
          </figcaption>
        </figure>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <article className="lg:col-span-7">
            <span className="font-mono text-eyebrow uppercase text-clay">
              The work
            </span>

            <p className="mt-4 whitespace-pre-line text-body leading-relaxed text-ink-muted">
              {event.description}
            </p>

            <dl className="mt-8 grid gap-px border border-bark bg-bark sm:grid-cols-2">
              <div className="bg-card p-5">
                <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  <CalendarDays className="size-3.5" aria-hidden />
                  When
                </dt>
                <dd className="mt-2 font-serif text-h3 text-ink">
                  {date?.long ?? "To be confirmed"}
                </dd>
              </div>

              <div className="bg-card p-5">
                <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  <MapPin className="size-3.5" aria-hidden />
                  Where
                </dt>
                <dd className="mt-2 text-small leading-relaxed text-ink">
                  {event.location}
                </dd>
              </div>

              <div className="bg-card p-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  Kind of work
                </dt>
                <dd className="mt-2">
                  <Tag tone={event.type}>{EVENT_TYPE_LABELS[event.type]}</Tag>
                </dd>
              </div>

              <div className="bg-card p-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  On the register since
                </dt>
                <dd className="mt-2 text-small leading-relaxed text-ink">
                  {posted?.long ?? "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex items-center gap-3 border-t border-bark pt-5">
              <Avatar user={{ name: event.creator.name, image: null }} size="md" />
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
                  Organised by
                </p>
                <p className="mt-1 truncate text-small font-medium text-ink">
                  {event.creator.name}
                </p>
              </div>
              <p className="ml-auto hidden max-w-[26ch] text-right text-[11px] leading-4 text-ink-muted sm:block">
                The person who posted this event can edit or close it.
              </p>
            </div>
          </article>

          <aside className="lg:col-span-5">
            <div className="border border-bark bg-card lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-3 border-b border-bark px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  Your place
                </span>
                {viewerHasJoined ? (
                  <Tag tone="joined">Joining</Tag>
                ) : (
                  <Tag tone={past ? "past" : "upcoming"}>
                    {past ? "Closed" : "Open"}
                  </Tag>
                )}
              </div>

              <div className="p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
                  When
                </p>
                <p className="mt-1.5 font-serif text-h3 text-ink">
                  {date?.long ?? "To be confirmed"}
                </p>

                <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
                  Where
                </p>
                <p className="mt-1.5 text-small leading-relaxed text-ink">
                  {event.location}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-y border-bark py-3">
                  <span className="inline-flex items-center gap-2 text-[12px] text-ink-muted">
                    <Users className="size-4" aria-hidden />
                    {event.participantCount}{" "}
                    {event.participantCount === 1 ? "neighbour" : "neighbours"} joined
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                    {past ? "Closed" : "Open"}
                  </span>
                </div>

                <div className="mt-5">
                  <JoinPanel
                    key={`${event.id}:${viewerHasJoined ? "joined" : "open"}:${event.participantCount}`}
                    eventId={event.id}
                    signedIn={Boolean(session)}
                    initiallyJoined={viewerHasJoined}
                    participantCount={event.participantCount}
                    isPast={past}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="mt-14 md:mt-20">
            <SectionHeader
              label="Keep looking"
              title="Three more mornings."
              action={
                <Button asChild variant="secondary" size="sm">
                  <Link href="/events">
                    All upcoming events
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              }
            />

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((candidate) => (
                <EventCard key={candidate.id} event={candidate} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
