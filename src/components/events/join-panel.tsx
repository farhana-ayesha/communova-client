"use client";

import { Check, Loader2, LogIn, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import {
  ApiError,
  SignInRequiredError,
  joinEventRequest,
  leaveEventRequest,
} from "@/lib/events-client";

/**
 * The only interactive part of the public detail page. Joining requires a
 * session, but reading never does — a guest sees the same page with a sign-in
 * prompt in place of the button.
 */
function JoinPanel({
  eventId,
  signedIn,
  initiallyJoined,
  participantCount,
  isPast,
}: {
  eventId: string;
  signedIn: boolean;
  initiallyJoined: boolean;
  participantCount: number;
  isPast: boolean;
}) {
  const router = useRouter();
  // The parent keys this panel on the server's join state and count, so a
  // refresh that returns different values remounts it rather than needing an
  // effect to copy props into state.
  const [joined, setJoined] = useState(initiallyJoined);
  const [count, setCount] = useState(participantCount);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);

    try {
      const view = joined
        ? await leaveEventRequest(eventId)
        : await joinEventRequest(eventId);

      setJoined(view.viewerHasJoined);
      setCount(view.event.participantCount);

      if (view.viewerHasJoined) {
        toast.success("You're on the list.", {
          description: "The event is now in your joined events.",
        });
      } else {
        toast.success("You left the event.", {
          description: "It has been removed from your joined events.",
        });
      }

      router.refresh();
    } catch (error) {
      if (error instanceof SignInRequiredError) {
        toast.error("Sign in to join an event.", {
          description: "Your place is saved as soon as you sign in.",
        });
        router.push(`/login?next=${encodeURIComponent(`/events/${eventId}`)}`);
        return;
      }

      toast.error("Could not update your place.", {
        description:
          error instanceof ApiError
            ? error.message
            : "Check your connection and try again.",
      });
    } finally {
      setPending(false);
    }
  }

  if (isPast) {
    return (
      <div>
        <Tag tone="past">Event closed</Tag>
        <p className="mt-3 text-[12px] leading-5 text-ink-muted">
          This date has passed. The record stays here, but joining is closed.
        </p>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div>
        <Button asChild size="lg" className="w-full justify-between">
          <Link href={`/login?next=${encodeURIComponent(`/events/${eventId}`)}`}>
            <span className="inline-flex items-center gap-2">
              <LogIn className="size-4" aria-hidden />
              Sign in to join
            </span>
          </Link>
        </Button>
        <p className="mt-3 text-[12px] leading-5 text-ink-muted">
          A free account takes a minute. Your name is added to this event and
          kept in your joined list.
        </p>
      </div>
    );
  }

  return (
    <div>
      {joined ? (
        <div className="mb-3 flex items-center gap-2 border border-fern/40 bg-fern/5 px-3 py-2 text-[12px] text-ink">
          <Check className="size-4 shrink-0 text-fern" aria-hidden />
          You are joining this event.
        </div>
      ) : null}

      <Button
        type="button"
        size="lg"
        variant={joined ? "secondary" : "primary"}
        className="w-full justify-between"
        onClick={() => void toggle()}
        disabled={pending}
        aria-busy={pending}
      >
        <span className="inline-flex items-center gap-2">
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : joined ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
          {pending
            ? joined
              ? "Leaving…"
              : "Joining…"
            : joined
              ? "Leave event"
              : "Join this event"}
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em] opacity-60">
          {count}
        </span>
      </Button>

      <p className="mt-3 text-[12px] leading-5 text-ink-muted">
        {joined
          ? "You can leave at any time; the organiser will see one fewer place taken."
          : "Joining adds this event to your joined list and tells the organiser someone is coming."}
      </p>
    </div>
  );
}

export { JoinPanel };
