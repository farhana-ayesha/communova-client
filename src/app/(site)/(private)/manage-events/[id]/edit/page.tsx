import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Button } from "@/components/ui/button";
import { toDateTimeLocal } from "@/lib/dates";
import { getEventView } from "@/lib/events";
import { getApiToken } from "@/lib/server-token";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Edit event",
  description: "Update an event you posted on the Communova register.",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  const token = session ? await getApiToken() : null;

  if (!token) {
    redirect(`/login?next=${encodeURIComponent(`/manage-events/${id}/edit`)}`);
  }

  const feed = await getEventView(id, token);

  if (!feed.ok) {
    if (feed.reason === "not_found") notFound();

    return (
      <div className="border border-bark bg-card px-6 py-12 md:px-10 md:py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
          Record unavailable
        </p>
        <h2 className="mt-3 font-serif text-h2 text-ink">
          This event could not be opened for editing.
        </h2>
        <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
          The events service is not answering right now. Nothing was changed;
          try again in a moment.
        </p>
        <Button asChild className="mt-6">
          <Link href="/manage-events">
            Back to manage events
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    );
  }

  const { event } = feed.data;

  // Only the member who posted the event may see the edit form.
  if (!session || event.creator.id !== session.user.id) {
    redirect(`/events/${event.id}`);
  }

  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div>
            <p className="font-mono text-eyebrow uppercase text-clay">
              Your record · editing
            </p>
            <h2 className="mt-4 max-w-[22ch] text-balance font-serif text-h1 text-ink">
              {event.title}
            </h2>
            <p className="mt-3 max-w-[54ch] text-body text-ink-muted">
              The change is public as soon as you save it. Past dates stay on the
              record; keep the original time or move the event into the future.
            </p>
          </div>

          <Button asChild variant="secondary" size="sm">
            <Link href={`/events/${event.id}`}>View public page</Link>
          </Button>
        </div>
      </div>

      <div className="mt-9">
        <EventForm
          mode="edit"
          eventId={event.id}
          originalEventDate={event.eventDate}
          defaultValues={{
            title: event.title,
            description: event.description,
            type: event.type,
            thumbnailUrl: event.thumbnailUrl,
            location: event.location,
            eventDate: toDateTimeLocal(event.eventDate),
          }}
        />
      </div>
    </div>
  );
}
