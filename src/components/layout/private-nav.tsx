"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/profile", label: "Profile" },
  { href: "/create-event", label: "Create event" },
  { href: "/manage-events", label: "Manage events" },
  { href: "/joined-events", label: "Joined events" },
] as const;

function PrivateNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Member record"
      className="-mb-px grid grid-cols-2 gap-x-6 sm:flex sm:flex-wrap"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap border-b-2 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              active
                ? "border-clay text-ink"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { PrivateNav };
