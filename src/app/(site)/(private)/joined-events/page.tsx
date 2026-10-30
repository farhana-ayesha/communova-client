import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Joined events",
  description: "Community service events you have joined through Communova.",
};

export default function JoinedEventsPage() {
  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-meta text-clay">M</span>
          <span className="font-mono text-eyebrow uppercase text-ink-muted">Your record</span>
        </div>
        <h2 className="mt-4 font-serif text-h1 text-ink">Joined events</h2>
        <p className="mt-3 max-w-[52ch] text-body text-ink-muted">
          Events you have signed up for, sorted by the date they happen. Past dates
          remain here as a record of the work.
        </p>
      </div>

      <div className="mt-9 border border-bark bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-bark px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            Joined by you
          </span>
          <span className="font-mono text-[10px] tracking-[0.12em] text-ink-muted">
            00 events
          </span>
        </div>

        <div className="px-5 py-12 md:px-10 md:py-16">
          <h3 className="max-w-[22ch] font-serif text-h2 text-ink">
            You have not joined an event yet.
          </h3>
          <p className="mt-3 max-w-[46ch] text-small leading-relaxed text-ink-muted">
            Browse the register, open an event near you, and add your name. It will
            appear here with its date and place.
          </p>
          <Button asChild className="mt-6">
            <Link href="/events">
              Browse upcoming events
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
