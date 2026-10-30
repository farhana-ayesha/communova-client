"use client";

import {
  CalendarDays,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { eventDateParts, isPastEvent } from "@/lib/dates";
import {
  ApiError,
  SignInRequiredError,
  deleteEventRequest,
} from "@/lib/events-client";
import { EVENT_TYPE_LABELS, type EventDto } from "@/types/event";

function ManageEventsList({ events }: { events: EventDto[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<EventDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!target || deleting) return;
    setDeleting(true);

    try {
      await deleteEventRequest(target.id);
      toast.success("Event deleted.", {
        description: `${target.title} is no longer on the register.`,
      });
      setTarget(null);
      router.refresh();
    } catch (error) {
      if (error instanceof SignInRequiredError) {
        toast.error("Sign in again to delete this event.", {
          description: "Your session expired while the page was open.",
        });
        router.push(`/login?next=${encodeURIComponent("/manage-events")}`);
        return;
      }

      toast.error("Could not delete the event.", {
        description:
          error instanceof ApiError
            ? error.message
            : "Check your connection and try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <ul className="border-y border-bark">
        {events.map((event) => {
          const date = eventDateParts(event.eventDate);
          const past = isPastEvent(event.eventDate);

          return (
            <li
              key={event.id}
              className="grid gap-4 border-b border-bark py-5 last:border-b-0 sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
            >
              <Link
                href={`/events/${event.id}`}
                tabIndex={-1}
                aria-hidden
                className="relative block aspect-[3/2] w-full overflow-hidden border border-bark bg-sand sm:w-[132px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </Link>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone={event.type}>{EVENT_TYPE_LABELS[event.type]}</Tag>
                  <Tag tone={past ? "past" : "upcoming"}>
                    {past ? "Past" : "Upcoming"}
                  </Tag>
                </div>

                <h3 className="mt-2.5 font-serif text-[22px] leading-tight tracking-[-0.01em] text-ink">
                  <Link
                    href={`/events/${event.id}`}
                    className="decoration-bark decoration-1 underline-offset-4 hover:underline"
                  >
                    {event.title}
                  </Link>
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] leading-5 text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden />
                    {date?.long ?? "Date to be confirmed"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden />
                    <span className="truncate">{event.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden />
                    {event.participantCount} joined
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/manage-events/${event.id}/edit`}>
                    <Pencil className="size-3.5" aria-hidden />
                    Edit
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setTarget(event)}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  Delete
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Dialog
        open={Boolean(target)}
        onOpenChange={(open) => {
          if (!open && !deleting) setTarget(null);
        }}
      >
        <DialogContent className="inset-auto left-1/2 top-1/2 h-auto w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 border border-bark bg-paper p-6 shadow-overlay">
          <DialogTitle>Delete this event?</DialogTitle>
          <DialogDescription className="mt-2">
            {target
              ? `“${target.title}” will be removed from the register, and the ${target.participantCount} ${
                  target.participantCount === 1 ? "place taken" : "places taken"
                } will be released.`
              : null}{" "}
            This cannot be undone.
          </DialogDescription>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={deleting}>
                Keep event
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={deleting}
              aria-busy={deleting}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
              {deleting ? "Deleting…" : "Delete event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ManageEventsList };
