import { CalendarDays, Image as ImageIcon, Layers, MapPin, AlignLeft, Type } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Create event",
  description: "Publish a community service event to the Communova register.",
};

const fields = [
  { label: "Title", detail: "What is being done, in one line.", icon: Type },
  { label: "Description", detail: "Who it helps and what to bring.", icon: AlignLeft },
  { label: "Event type", detail: "Cleanup, plantation, donation, or another.", icon: Layers },
  { label: "Thumbnail URL", detail: "A landscape photograph of the work.", icon: ImageIcon },
  { label: "Location", detail: "The neighbourhood and meeting point.", icon: MapPin },
  { label: "Date", detail: "A future date; past dates are refused.", icon: CalendarDays },
] as const;

export default function CreateEventPage() {  return (
    <div>
      <div className="border-t border-bark pt-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-meta text-clay">M</span>
          <span className="font-mono text-eyebrow uppercase text-ink-muted">Your record</span>
        </div>
        <h2 className="mt-4 font-serif text-h1 text-ink">Create an event</h2>
        <p className="mt-3 max-w-[52ch] text-body text-ink-muted">
          One service event, posted under your name. These are the six things the
          register keeps for every event.
        </p>
      </div>

      <div className="mt-9 grid gap-px border border-bark bg-bark sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field, index) => (
          <div key={field.label} className="bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.12em] text-clay">
                {String(index + 1).padStart(2, "0")}
              </span>
              <field.icon className="size-4 text-ink-muted" aria-hidden />
            </div>
            <h3 className="mt-4 text-small font-medium text-ink">{field.label}</h3>
            <p className="mt-1.5 text-[12px] leading-5 text-ink-muted">{field.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <Link href="/manage-events">See events you manage</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/events">Browse the register</Link>
        </Button>
      </div>
    </div>
  );
}
