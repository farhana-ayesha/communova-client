import { ArrowRight, CalendarPlus, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ManageEventsList } from "@/components/events/manage-events-list";
import { Button } from "@/components/ui/button";
import { getEventsByCreator } from "@/lib/events";
import { getApiToken } from "@/lib/server-token";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Manage events",
  description: "Events you have created on Communova.",
};

export default async function ManageEventsPage() {
  const session = await getSession();
  const token = session ? await getApiToken() : null;
  const feed = token ? await getEventsByCreator(token) : null;

  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div>
            <p className="font-mono text-eyebrow uppercase text-clay">
              Your record
            </p>
            <h2 className="mt-4 max-w-[20ch] text-balance font-serif text-h1 text-ink">
              Events you manage
            </h2>
            <p className="mt-3 max-w-[54ch] text-body text-ink-muted">
              Every event you publish is listed here. Only you can edit or delete
              it, and its participants are counted as they join.
            </p>
          </div>

          <Button asChild size="sm">
            <Link href="/create-event">
              <CalendarPlus className="size-4" aria-hidden />
              Create event
            </Link>
          </Button>
        </div>
      </div>

      {!feed || !feed.ok ? (
        <div className="mt-9 border border-bark bg-card px-6 py-12 md:px-10 md:py-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
            Register resting
          </p>
          <h3 className="mt-3 max-w-[24ch] font-serif text-h2 text-ink">
            Your events could not be loaded.
          </h3>
          <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
            The events service is not answering right now. Nothing has changed;
            reload this page in a moment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/manage-events">
                <RefreshCw className="size-4" aria-hidden />
                Try again
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/create-event">Create an event</Link>
            </Button>
          </div>
        </div>
      ) : feed.data.length === 0 ? (
        <div className="mt-9 border border-bark bg-card px-6 py-12 md:px-10 md:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
            No events yet
          </p>
          <h3 className="mt-3 max-w-[22ch] font-serif text-h2 text-ink">
            Nothing on your record yet.
          </h3>
          <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
            Start with one event: a street cleanup, a winter clothes collection,
            or a plantation morning. It stays yours to edit.
          </p>
          <Button asChild className="mt-6">
            <Link href="/create-event">
              <CalendarPlus className="size-4" aria-hidden />
              Create an event
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-9 flex items-center justify-between gap-4 border-y border-bark py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Created by you
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
              {feed.data.length} {feed.data.length === 1 ? "event" : "events"}
            </span>
          </div>

          <div className="mt-2">
            <ManageEventsList events={feed.data} />
          </div>

          <div className="mt-8">
            <Button asChild variant="link">
              <Link href="/joined-events">
                See events you have joined
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
