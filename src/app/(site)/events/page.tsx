import { ArrowRight, CalendarPlus, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getUpcomingEvents } from "@/lib/events";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Upcoming events",
  description:
    "Every upcoming community service event on the Communova register, closest date first.",
};

export default async function EventsPage() {
  const [session, feed] = await Promise.all([
    getSession(),
    getUpcomingEvents(),
  ]);

  const events = feed.ok ? feed.data : [];
  const count = events.length;

  return (
    <Container className="py-10 md:py-14">
      <div className="border-t border-bark pt-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-meta text-clay">01</span>
          <span className="font-mono text-eyebrow uppercase text-ink-muted">
            The register
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <h1 className="max-w-[20ch] text-balance font-serif text-h1 text-ink">
            Upcoming events
          </h1>
          {session ? (
            <Button asChild size="sm">
              <Link href="/create-event">
                <CalendarPlus className="size-4" aria-hidden />
                Create event
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/register">Open a record</Link>
            </Button>
          )}
        </div>

        <p className="mt-4 max-w-[56ch] text-body text-ink-muted">
          Events posted by members, sorted by the date they happen. Past dates
          drop off this page and remain on their own record.
        </p>
      </div>

      {feed.ok ? (
        <>
          <div className="mt-9 flex items-center justify-between gap-4 border-y border-bark py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Register · upcoming
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
              {String(count).padStart(2, "0")}{" "}
              {count === 1 ? "entry" : "entries"}
            </span>
          </div>

          {count > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-bark bg-card px-6 py-14 md:px-10 md:py-20">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
                Nothing listed yet
              </p>
              <h2 className="mt-3 max-w-[22ch] font-serif text-h2 text-ink">
                The first entry is waiting for a neighbour.
              </h2>
              <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
                When a member publishes a cleanup, plantation drive, or
                collection, it appears here with its date, place, and the person
                who posted it.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={session ? "/create-event" : "/register"}>
                    {session ? "Create the first event" : "Open a record"}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/">Back to the almanac</Link>
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-9 border border-bark bg-card px-6 py-14 md:px-10 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
            Register resting
          </p>
          <h2 className="mt-3 max-w-[24ch] font-serif text-h2 text-ink">
            The register could not be reached.
          </h2>
          <p className="mt-3 max-w-[50ch] text-small leading-relaxed text-ink-muted">
            {feed.reason === "offline"
              ? "The events service is not answering right now. The rest of the site still works; try the register again in a moment."
              : "Something interrupted the register. Reload this page, or return to the almanac and try again."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/events">
                <RefreshCw className="size-4" aria-hidden />
                Try again
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Back to the almanac</Link>
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
