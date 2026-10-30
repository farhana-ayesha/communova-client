"use client";

import {
  ArrowRight,
  BookmarkCheck,
  CalendarPlus,
  ClipboardList,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar } from "@/components/user/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

type Member = {
  name: string;
  email: string;
  image?: string | null;
};

/**
 * Mobile navigation is a full-height paper panel, not a floating sheet: it
 * keeps the same square edges and hairlines as the rest of the system.
 */
function MobileNav({ user }: { user: Member | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Could not sign you out.");
      return;
    }

    setOpen(false);
    toast.success("Signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden />
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="mobile-nav-description">
        <div className="flex items-center justify-between border-b border-bark px-5 py-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
            aria-label="Communova home"
          >
            <Monogram className="size-6 text-ink" />
            <Wordmark className="text-xl" />
          </Link>
          <span className="mr-14 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Menu
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-8">
          <DialogTitle className="sr-only">Site menu</DialogTitle>
          <DialogDescription id="mobile-nav-description" className="sr-only">
            Navigate the public site and your member record.
          </DialogDescription>

          <nav aria-label="Mobile primary" className="grid gap-1">
            <DialogClose asChild>
              <Link
                href="/events"
                className="flex items-baseline justify-between border-b border-bark py-4 font-serif text-h3 text-ink"
              >
                Upcoming events
                <ArrowRight className="size-4 self-center text-ink-muted" aria-hidden />
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link
                href="/"
                className="flex items-baseline justify-between border-b border-bark py-4 font-serif text-h3 text-ink"
              >
                The almanac
                <ArrowRight className="size-4 self-center text-ink-muted" aria-hidden />
              </Link>
            </DialogClose>
          </nav>

          {user ? (
            <div className="mt-10">
              <div className="flex items-center gap-3 border-b border-bark pb-5">
                <Avatar user={user} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-small font-medium text-ink">{user.name}</p>
                  <p className="truncate font-mono text-[10px] text-ink-muted">{user.email}</p>
                </div>
              </div>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                Your record
              </p>
              <div className="mt-2 grid">
                {[
                  { href: "/create-event", label: "Create event", icon: CalendarPlus },
                  { href: "/manage-events", label: "Manage events", icon: ClipboardList },
                  { href: "/joined-events", label: "Joined events", icon: BookmarkCheck },
                  { href: "/profile", label: "Your profile", icon: UserRound },
                ].map((item) => (
                  <DialogClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 border-b border-bark/70 py-3.5 text-small text-ink"
                    >
                      <item.icon className="size-4 text-ink-muted" aria-hidden />
                      {item.label}
                    </Link>
                  </DialogClose>
                ))}
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="mt-6 w-full justify-between"
                onClick={() => void handleSignOut()}
              >
                Log out
                <LogOut className="size-4" aria-hidden />
              </Button>
            </div>
          ) : (
            <div className="mt-10 space-y-3">
              <Button asChild size="lg" className="w-full justify-between">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full">
                <Link href="/register" onClick={() => setOpen(false)}>
                  Open a record
                </Link>
              </Button>
              <p className="pt-2 text-[12px] leading-5 text-ink-muted">
                An account lets you create events, join them, and keep the list.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-bark px-5 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Communova · Dhaka
          </span>
          <ThemeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { MobileNav };
