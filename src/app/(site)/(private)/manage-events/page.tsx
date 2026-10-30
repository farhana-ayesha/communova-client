import { ArrowRight, CalendarPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Manage events",
  description: "Events you have created on Communova.",
};

export default function ManageEventsPage() {
  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-meta text-clay">M</span>
          <span className="font-mono text-eyebrow uppercase text-ink-muted">Your record</span>
        </div>
        <h2 className="mt-4 font-serif text-h1 text-ink">Manage events</h2>
        <p className="mt-3 max-w-[52ch] text-body text-ink-muted">
          Every event you publish is listed here. Only the person who created an
          event can update or delete it.
        </p>
      </div>

      <div className="mt-9 border border-bark bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-bark px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            Created by you
          </span>
          <span className="font-mono text-[10px] tracking-[0.12em] text-ink-muted">
            00 events
          </span>
        </div>

        <div className="px-5 py-12 md:px-10 md:py-16">
          <h3 className="max-w-[22ch] font-serif text-h2 text-ink">Nothing on your record yet.</h3>
          <p className="mt-3 max-w-[46ch] text-small leading-relaxed text-ink-muted">
            Start with one event: a street cleanup, a winter clothes collection, or
            a plantation morning. It stays yours to edit.
          </p>
          <Button asChild className="mt-6">
            <Link href="/create-event">
              <CalendarPlus className="size-4" aria-hidden />
              Create an event
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <Button asChild variant="link">
          <Link href="/joined-events">
            See events you have joined
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}
