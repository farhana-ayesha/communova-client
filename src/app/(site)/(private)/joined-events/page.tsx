import { ArrowRight, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { splitByDate } from "@/lib/dates";
import { getJoinedEvents } from "@/lib/events";
import { getApiToken } from "@/lib/server-token";
import { getSession } from "@/lib/session";
import type { EventDto } from "@/types/event";

export const metadata: Metadata = {
  title: "Joined events",
  description: "Community service events you have joined through Communova.",
};

function GroupHeading({
  label,
  title,
  count,
}: {
  label: string;
  title: string;
  count: number;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-bark pb-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
          {label}
        </p>
        <h3 className="mt-2 font-serif text-h2 text-ink">{title}</h3>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
        {count} {count === 1 ? "event" : "events"}
      </p>
    </div>
  );
}

export default async function JoinedEventsPage() {
  const session = await getSession();
  const token = session ? await getApiToken() : null;
  const feed = token ? await getJoinedEvents(token) : null;

  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div>
            <p className="font-mono text-eyebrow uppercase text-clay">
              Your record
            </p>
            <h2 className="mt-4 max-w-[20ch] text-balance font-serif text-h1 text-ink">
              Events you have joined
            </h2>
            <p className="mt-3 max-w-[54ch] text-body text-ink-muted">
              The mornings you signed up for, sorted by the date they happen.
              Past dates stay here as a record of the work.
            </p>
          </div>

          <Button asChild variant="secondary" size="sm">
            <Link href="/events">Browse the register</Link>
          </Button>
        </div>
      </div>

      {!feed || !feed.ok ? (
        <div className="mt-9 border border-bark bg-card px-6 py-12 md:px-10 md:py-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
            Register resting
          </p>
          <h3 className="mt-3 max-w-[24ch] font-serif text-h2 text-ink">
            Your joined events could not be loaded.
          </h3>
          <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
            The events service is not answering right now. Your place is safe;
            reload this page in a moment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/joined-events">
                <RefreshCw className="size-4" aria-hidden />
                Try again
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/events">Browse the register</Link>
            </Button>
          </div>
        </div>
      ) : feed.data.length === 0 ? (
        <div className="mt-9 border border-bark bg-card px-6 py-12 md:px-10 md:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
            Nothing joined yet
          </p>
          <h3 className="mt-3 max-w-[22ch] font-serif text-h2 text-ink">
            You have not joined an event yet.
          </h3>
          <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
            Browse the register, open an event near you, and add your name. It
            will appear here with its date and place.
          </p>
          <Button asChild className="mt-6">
            <Link href="/events">
              Browse upcoming events
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      ) : (
        <JoinedGroups events={feed.data} />
      )}
    </div>
  );
}

function JoinedGroups({ events }: { events: EventDto[] }) {
  const { upcoming, past } = splitByDate(events);

  return (
    <div className="mt-9 space-y-12">
      {upcoming.length > 0 ? (
        <section>
          <GroupHeading
            label="Still ahead"
            title="Mornings you are part of."
            count={upcoming.length}
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section>
          <GroupHeading
            label="Already happened"
            title="The part of the record that is done."
            count={past.length}
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
