import type { Metadata } from "next";
import Link from "next/link";
import { EventForm } from "@/components/events/event-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Create event",
  description: "Publish a community service event to the Communova register.",
};

export default function CreateEventPage() {
  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div>
            <p className="font-mono text-eyebrow uppercase text-clay">
              Your record
            </p>
            <h2 className="mt-4 max-w-[18ch] text-balance font-serif text-h1 text-ink">
              Put a morning on the register.
            </h2>
            <p className="mt-3 max-w-[54ch] text-body text-ink-muted">
              One service event, posted under your name. Say what will be done,
              where to meet, and what a neighbour should bring.
            </p>
          </div>

          <Button asChild variant="secondary" size="sm">
            <Link href="/events">See the register</Link>
          </Button>
        </div>
      </div>

      <div className="mt-9">
        <EventForm
          mode="create"
          defaultValues={{
            title: "",
            description: "",
            type: "cleanup",
            thumbnailUrl: "",
            location: "",
            eventDate: "",
          }}
        />
      </div>
    </div>
  );
}
