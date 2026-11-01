import { ArrowUpRight, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import { Avatar } from "@/components/user/avatar";
import { eventDateParts, isPastEvent } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { EVENT_TYPE_LABELS, type EventDto } from "@/types/event";

/**
 * The register card: photograph, date plate, type dot, and the two facts that
 * matter — where it is and who is going. Cards stretch to equal height in the
 * grid, and the image is member-supplied so it stays a plain `<img>`.
 */
function EventCard({
  event,
  className,
}: {
  event: EventDto;
  className?: string;
}) {
  const date = eventDateParts(event.eventDate);
  const past = isPastEvent(event.eventDate);
  const href = `/events/${event.id}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col border border-bark bg-card transition-colors hover:border-ink/35",
        className,
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[3/2] overflow-hidden border-b border-bark bg-sand"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnailUrl}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />
        {date ? (
          <span className="absolute left-3 top-3 grid min-w-[52px] place-items-center border border-bark bg-paper px-2 py-1.5 text-center">
            <span className="font-serif text-[26px] leading-none text-ink">
              {date.dayPadded}
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase leading-none tracking-[0.16em] text-ink-muted">
              {date.month}
            </span>
          </span>
        ) : null}
        {past ? (
          <span className="absolute right-3 top-3 border border-bark bg-paper px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
            Past
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <Tag tone={event.type}>{EVENT_TYPE_LABELS[event.type]}</Tag>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
            <Users className="size-3.5" aria-hidden />
            {event.participantCount} joined
          </span>
        </div>

        <h3 className="mt-3.5 line-clamp-2 font-serif text-[23px] leading-[1.12] tracking-[-0.01em] text-ink">
          <Link
            href={href}
            className="decoration-bark decoration-1 underline-offset-4 hover:underline"
          >
            {event.title}
          </Link>
        </h3>

        <p className="mt-2.5 flex items-start gap-1.5 text-[12px] leading-5 text-ink-muted">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-2">{event.location}</span>
        </p>

        <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-ink-muted">
          {event.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-bark pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar
              user={{ name: event.creator.name, image: event.creator.image }}
              size="sm"
            />
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
                Organised by
              </p>
              <p className="mt-1.5 truncate text-[12px] leading-4 text-ink">
                {event.creator.name}
              </p>
            </div>
          </div>

          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1.5 border-b border-transparent pb-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-clay hover:text-clay"
            aria-label={`View event: ${event.title}`}
          >
            View event
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export { EventCard };
