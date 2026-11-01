import {
  ArrowRight,
  CalendarPlus,
  ClipboardList,
  ExternalLink,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/user/avatar";
import { ProfileEditForm } from "@/components/user/profile-edit-form";
import { SignOutButton } from "@/components/user/sign-out-button";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { eventDateParts, splitByDate } from "@/lib/dates";
import { getEventsByCreator, getJoinedEvents } from "@/lib/events";
import { isGoogleConfigured } from "@/lib/oauth";
import { getApiToken } from "@/lib/server-token";
import { getSession } from "@/lib/session";
import type { EventDto } from "@/types/event";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Your Communova member record and account details.",
};

function formatMemberSince(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function ActivityList({
  label,
  empty,
  events,
  href,
}: {
  label: string;
  empty: string;
  events: EventDto[];
  href: string;
}) {
  return (
    <div className="border border-bark bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-bark px-5 py-3">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
          {label}
        </h4>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-clay"
        >
          All
          <ArrowRight className="size-3" aria-hidden />
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="px-5 py-4 text-[12px] leading-5 text-ink-muted">{empty}</p>
      ) : (
        <ul>
          {events.map((event) => {
            const date = eventDateParts(event.eventDate);
            return (
              <li key={event.id} className="border-b border-bark last:border-b-0">
                <Link
                  href={`/events/${event.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-sand"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] leading-5 text-ink">
                      {event.title}
                    </span>
                    <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                      {date?.short ?? "Date to be confirmed"}
                    </span>
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-ink-muted" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default async function ProfilePage() {
  const session = await getSession();

  // The private layout already guarantees a session; this narrows the type.
  if (!session) return null;

  const { user } = session;
  const token = await getApiToken();

  const [createdFeed, joinedFeed] = token
    ? await Promise.all([getEventsByCreator(token), getJoinedEvents(token)])
    : [null, null];

  const created = createdFeed?.ok ? createdFeed.data : null;
  const joined = joinedFeed?.ok ? joinedFeed.data : null;
  const activityUnavailable = !created || !joined;

  const upcomingIds = new Set<string>();
  if (created) {
    for (const event of splitByDate(created).upcoming) upcomingIds.add(event.id);
  }
  if (joined) {
    for (const event of splitByDate(joined).upcoming) upcomingIds.add(event.id);
  }

  const stats = [
    {
      label: "Events created",
      value: created ? String(created.length) : "—",
      href: "/manage-events",
      hint: "Manage them",
      icon: ClipboardList,
    },
    {
      label: "Events joined",
      value: joined ? String(joined.length) : "—",
      href: "/joined-events",
      hint: "See the list",
      icon: CalendarPlus,
    },
    {
      label: "Upcoming",
      value: activityUnavailable ? "—" : String(upcomingIds.size),
      href: "/events",
      hint: "Browse the register",
      icon: ExternalLink,
    },
  ] as const;

  const facts = [
    ["Member since", formatMemberSince(user.createdAt)],
    ["Account ID", user.id],
    [
      "Sign-in",
      isGoogleConfigured() ? "Email & password · Google" : "Email & password",
    ],
  ] as const;

  return (
    <div>
      <div className="border-t border-bark pt-6">
        <span className="font-mono text-eyebrow uppercase text-clay">
          Your record
        </span>
        <h2 className="mt-4 font-serif text-h1 text-ink">Profile</h2>
        <p className="mt-3 max-w-[52ch] text-body text-ink-muted">
          The identity attached to every event you create and every event you join.
        </p>
      </div>

      <div className="mt-9 grid gap-px border border-bark bg-bark lg:grid-cols-12">
        <div className="bg-card p-6 md:p-8 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar user={user} size="xl" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                Display name
              </p>
              <p className="mt-1 truncate font-serif text-h2 text-ink">{user.name}</p>
              <p className="mt-1 break-all font-mono text-[11px] tracking-[0.04em] text-ink-muted">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-bark pt-5">
            <p className="max-w-[46ch] text-small leading-relaxed text-ink-muted">
              This name and photo appear on the event cards you publish, so
              neighbours know who is organising the work.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="secondary" size="sm">
                <Link href="/create-event">
                  <CalendarPlus className="size-4" aria-hidden />
                  Create an event
                </Link>
              </Button>
              <SignOutButton />
            </div>
          </div>

          <ProfileEditForm name={user.name} image={user.image ?? null} />
        </div>

        <div className="flex flex-col bg-card lg:col-span-5">
          <div className="border-b border-bark px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Account facts
            </p>
          </div>
          <dl>
            {facts.map(([label, value]) => (
              <div key={label} className="border-b border-bark px-5 py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  {label}
                </dt>
                <dd className="mt-1.5 break-all font-mono text-[12px] leading-5 text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto px-5 py-5">
            <Tag tone="upcoming">Active record</Tag>
            <p className="mt-3 text-[12px] leading-5 text-ink-muted">
              Your account ID attributes every event you create and join. It is never
              shown on public event pages.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-baseline justify-between gap-4 border-t border-bark pt-5">
          <h3 className="font-serif text-h3 text-ink">Your activity</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Live from the register
          </span>
        </div>

        <div className="mt-5 grid gap-px border border-bark bg-bark sm:grid-cols-3">
          {stats.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group bg-card px-5 py-5 transition-colors hover:bg-sand"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  {item.label}
                </span>
                <item.icon className="size-4 text-ink-muted" aria-hidden />
              </div>
              <p className="mt-3 font-serif text-h1 text-ink">{item.value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted transition-colors group-hover:text-clay">
                {item.hint}
              </p>
            </Link>
          ))}
        </div>

        {activityUnavailable ? (
          <p className="mt-3 text-[12px] leading-5 text-ink-muted">
            Some activity counts are unavailable while the register is resting.
            Reload the page in a moment.
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ActivityList
            label="Events you created"
            empty={
              created
                ? "Nothing published yet. Create the first event on your record."
                : "This list is unavailable while the register is resting."
            }
            events={(created ?? []).slice(0, 3)}
            href="/manage-events"
          />
          <ActivityList
            label="Events you joined"
            empty={
              joined
                ? "No joined events yet. Browse the register and add your name."
                : "This list is unavailable while the register is resting."
            }
            events={(joined ?? []).slice(0, 3)}
            href="/joined-events"
          />
        </div>
      </div>
    </div>
  );
}
