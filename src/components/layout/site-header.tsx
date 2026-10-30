import Link from "next/link";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

const navItems = [{ href: "/events", label: "Upcoming events" }] as const;

/**
 * The masthead. The member state is resolved on the server so a signed-in
 * reload paints the avatar immediately — there is no login flash.
 */
async function SiteHeader() {
  const session = await getSession();
  const user = session?.user
    ? { name: session.user.name, email: session.user.email, image: session.user.image }
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-bark bg-paper">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Communova home">
            <Monogram className="size-6 text-ink" />
            <Wordmark className="text-[22px] md:text-[25px]" />
            <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted md:inline">
              Dhaka
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          {!user ? (
            <Button asChild variant="secondary" size="sm" className="lg:hidden">
              <Link href="/login">Login</Link>
            </Button>
          ) : null}
          <ThemeToggle />
          <div className="hidden lg:block">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button asChild variant="secondary" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
          <MobileNav user={user} />
        </div>
      </Container>
    </header>
  );
}

export { SiteHeader };
