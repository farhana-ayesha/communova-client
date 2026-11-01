"use client";

import {
  BookmarkCheck,
  CalendarPlus,
  ClipboardList,
  LogOut,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar } from "@/components/user/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { clearViewerToken } from "@/lib/events-client";

type Member = {
  name: string;
  email: string;
  image?: string | null;
};

const items = [
  { href: "/create-event", label: "Create event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage events", icon: ClipboardList },
  { href: "/joined-events", label: "Joined events", icon: BookmarkCheck },
  { href: "/profile", label: "Your profile", icon: UserRound },
] as const;

/**
 * The profile picture carries a hover label with the member's display name,
 * and opens the private navigation on click.
 */
function UserMenu({ user }: { user: Member }) {
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Could not sign you out.", {
        description: "Check your connection and try again.",
      });
      return;
    }

    clearViewerToken();
    toast.success("Signed out.", { description: "Your record stays where you left it." });
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group relative ml-1 inline-flex items-center gap-2 rounded-[2px] p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={`Account menu for ${user.name}`}
        >
          <Avatar user={user} size="md" />
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-[calc(100%+10px)] z-50 hidden whitespace-nowrap border border-bark bg-card px-2.5 py-1.5 text-[12px] leading-none text-ink shadow-overlay opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:block"
          >
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[264px]">
        <div className="flex items-center gap-3 px-2.5 py-2.5">
          <Avatar user={user} size="md" />
          <div className="min-w-0">
            <p className="truncate text-small font-medium text-ink">{user.name}</p>
            <p className="truncate font-mono text-[10px] tracking-[0.04em] text-ink-muted">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Your record</DropdownMenuLabel>

        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>
              <item.icon aria-hidden />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void handleSignOut()} className="text-clay [&_svg]:text-clay">
          <LogOut aria-hidden />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserMenu };
