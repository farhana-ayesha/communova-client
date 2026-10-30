import { ArrowRight, CalendarPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Upcoming events",
  description:
    "Every upcoming community service event on the Communova register, closest date first.",
};

export default async function EventsPage() {
  const session = await getSession();

  return (
    <Container className="py-10 md:py-14">
      <div className="border-t border-bark pt-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-meta text-clay">01</span>
          <span className="font-mono text-eyebrow uppercase text-ink-muted">The register</span>
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
          Events posted by members, sorted by the date they happen. Past dates drop
          off this page and remain on their own record.
        </p>
      </div>

      <div className="mt-10 border border-bark bg-card">
        <div className="flex items-center justify-between gap-4 border-b border-bark px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            Register · upcoming
          </span>
          <span className="font-mono text-[10px] tracking-[0.12em] text-ink-muted">
            00 entries
          </span>
        </div>

        <div className="px-5 py-14 md:px-10 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
            Nothing listed yet
          </p>
          <h2 className="mt-3 max-w-[22ch] font-serif text-h2 text-ink">
            The first entry is waiting for a neighbour.
          </h2>
          <p className="mt-3 max-w-[48ch] text-small leading-relaxed text-ink-muted">
            When a member publishes a cleanup, plantation drive, or collection, it
            appears here with its date, place, and the person who posted it.
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
      </div>
    </Container>
  );
}
