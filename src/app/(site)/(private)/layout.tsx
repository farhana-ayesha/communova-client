import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { PrivateNav } from "@/components/layout/private-nav";
import { Avatar } from "@/components/user/avatar";
import { getSession } from "@/lib/session";

/**
 * Private shell. The proxy has already turned away cookie-less visitors; this
 * layout re-checks the real session, so a stale or forged cookie still cannot
 * render a private page.
 */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div>
      <section className="border-b border-bark bg-sand/60">
        <Container className="pt-8 md:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="font-mono text-eyebrow uppercase text-clay">
                  Member record · signed in
                </p>
                <h1 className="mt-2 truncate font-serif text-h2 text-ink">{user.name}</h1>
                <p className="mt-1 truncate font-mono text-[11px] tracking-[0.04em] text-ink-muted">
                  {user.email}
                </p>
              </div>
            </div>

            <p className="hidden max-w-[26ch] text-small leading-relaxed text-ink-muted md:block">
              Everything you create, join, or manage is kept under this record.
            </p>
          </div>

          <div className="mt-7">
            <PrivateNav />
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">{children}</Container>
    </div>
  );
}
