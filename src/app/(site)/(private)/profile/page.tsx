import { CalendarPlus, ClipboardList, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/user/avatar";
import { SignOutButton } from "@/components/user/sign-out-button";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { getSession } from "@/lib/session";

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

export default async function ProfilePage() {
  const session = await getSession();

  // The private layout already guarantees a session; this narrows the type.
  if (!session) return null;

  const { user } = session;

  const facts = [
    ["Member since", formatMemberSince(user.createdAt)],
    ["Account ID", user.id],
    ["Sign-in", "Email & password"],
  ] as const;

  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-meta text-clay">M</span>
          <span className="font-mono text-eyebrow uppercase text-ink-muted">Your record</span>
        </div>
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
          {[
            { label: "Events created", value: "00", href: "/manage-events", icon: ClipboardList },
            { label: "Events joined", value: "00", href: "/joined-events", icon: CalendarPlus },
            { label: "Upcoming", value: "00", href: "/events", icon: ExternalLink },
          ].map((item) => (
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
                Open the list
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
