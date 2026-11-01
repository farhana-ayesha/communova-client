import { ArrowRight, Bug, Code, MapPin } from "lucide-react";
import Link from "next/link";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { getSession } from "@/lib/session";

const REPOSITORY_URL = "https://github.com/farhana-ayesha/communova-client";
const ISSUES_URL = `${REPOSITORY_URL}/issues/new`;

const explore = [
  { href: "/events", label: "Upcoming events" },
  { href: "/#features", label: "How it works" },
  { href: "/", label: "The almanac" },
] as const;

const member = [
  { href: "/profile", label: "Your profile" },
  { href: "/create-event", label: "Create event" },
  { href: "/joined-events", label: "Joined events" },
  { href: "/manage-events", label: "Manage events" },
] as const;

/**
 * A dark canopy footer closes every page, so the warm paper pages end on a
 * deliberate, high-contrast note rather than trailing off.
 */
async function SiteFooter() {
  const session = await getSession();
  const user = session?.user ?? null;

  return (
    <footer className="mt-auto bg-canopy text-on-brand">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Communova home">
              <Monogram className="size-8 text-on-brand" />
              <Wordmark className="text-2xl text-on-brand" />
            </Link>

            <p className="mt-5 max-w-[34ch] text-body leading-relaxed text-on-brand/75">
              A civic almanac for Dhaka: the cleanups, plantation drives, and
              collections that neighbours organise â€” and a public record of who
              showed up.
            </p>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-on-brand/50">
              A public record Â· Dhaka, Bangladesh
            </p>
          </div>

          <nav aria-label="Explore" className="lg:col-span-2">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-marigold">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-small text-on-brand/75 transition-colors hover:text-on-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Your record" className="lg:col-span-2">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-marigold">
              {user ? "Your record" : "Membership"}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {user ? (
                member.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-small text-on-brand/75 transition-colors hover:text-on-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-small text-on-brand/75 transition-colors hover:text-on-brand"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-small text-on-brand/75 transition-colors hover:text-on-brand"
                    >
                      Open a record
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1 text-small text-on-brand/75 transition-colors hover:text-on-brand"
                >
                  Start here
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-marigold">
              Project
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-start gap-2.5 text-small text-on-brand/75 transition-colors hover:text-on-brand"
                >
                  <Code className="mt-0.5 size-4 shrink-0" aria-hidden />
                  Source code
                </a>
              </li>
              <li>
                <a
                  href={ISSUES_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-start gap-2.5 text-small text-on-brand/75 transition-colors hover:text-on-brand"
                >
                  <Bug className="mt-0.5 size-4 shrink-0" aria-hidden />
                  Report an issue
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5 text-small text-on-brand/75">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                Dhaka, Bangladesh
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2">
              <a
                href={REPOSITORY_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Communova source code on GitHub"
                className="grid size-9 place-items-center border border-on-brand/20 text-on-brand/75 transition-colors hover:border-on-brand/50 hover:text-on-brand"
              >
                <Code className="size-4" aria-hidden />
              </a>
              <a
                href={ISSUES_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Report a Communova issue"
                className="grid size-9 place-items-center border border-on-brand/20 text-on-brand/75 transition-colors hover:border-on-brand/50 hover:text-on-brand"
              >
                <Bug className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-on-brand/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-on-brand/50">
            Â© 2026 Communova Â· every event is a record
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-on-brand/50">
            Designed and built in Dhaka
          </p>
        </div>
      </Container>
    </footer>
  );
}

export { SiteFooter };
