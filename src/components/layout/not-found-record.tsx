import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The shared 404 panel. `app/not-found.tsx` wraps it in the standalone
 * header/footer used outside the site group; `(site)/not-found.tsx` drops it
 * into the existing shell so the header is never rendered twice.
 */
function NotFoundRecord() {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <p className="font-mono text-eyebrow uppercase text-clay">Record not found</p>
        <h1 className="mt-5 max-w-[18ch] text-balance font-serif text-h1 text-ink">
          This page is missing from the almanac.
        </h1>
        <p className="mt-5 max-w-[48ch] text-body text-ink-muted">
          The address you followed does not match an entry. The register is
          public, so start from the events list or return to the front page.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/events">
              Browse upcoming events
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden />
              Back to the almanac
            </Link>
          </Button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="border border-bark bg-card">
          <div className="flex items-center justify-between border-b border-bark px-5 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Register entry
            </span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-clay">
              Error 404
            </span>
          </div>
          <div className="px-5 py-10">
            <p className="font-serif text-[clamp(4rem,10vw,7rem)] leading-none tracking-[-0.03em] text-ink">
              404
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-ink-muted">
              No event, page, or member record exists at this address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NotFoundRecord };
