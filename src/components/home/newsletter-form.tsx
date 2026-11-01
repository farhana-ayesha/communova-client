"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, subscribeToNewsletter } from "@/lib/events-client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Confirmation = {
  email: string;
  alreadySubscribed: boolean;
};

/**
 * Newsletter sign-up is persisted by the Express API. Repeat submissions are
 * idempotent, so an address that is already on the list is acknowledged rather
 * than reported as a failure.
 */
function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmation | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    const value = email.trim();

    if (!value) {
      setError("Enter your email address.");
      toast.error("Add an email address.", {
        description: "The dispatch needs somewhere to go.",
      });
      return;
    }

    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address, like you@example.com.");
      toast.error("That email address looks incomplete.", {
        description: "Check for a missing @ or domain.",
      });
      return;
    }

    setError(null);
    setPending(true);

    try {
      const subscription = await subscribeToNewsletter(value);

      setConfirmed({
        email: subscription.email,
        alreadySubscribed: subscription.alreadySubscribed,
      });
      setEmail("");

      if (subscription.alreadySubscribed) {
        toast.info("That address is already on the list.", {
          description: `${subscription.email} is already saved for the dispatch.`,
        });
      } else {
        toast.success("You're on the list.", {
          description: `${subscription.email} is saved for the next dispatch.`,
        });
      }
    } catch (requestError) {
      const message =
        requestError instanceof ApiError
          ? requestError.message
          : "Check your connection and try again.";

      setError(message);
      toast.error("Could not add that address.", { description: message });
    } finally {
      setPending(false);
    }
  }

  if (confirmed) {
    return (
      <div
        role="status"
        className="border border-on-brand/25 bg-on-brand/5 p-5 md:p-6"
      >
        <span className="inline-grid size-8 place-items-center border border-marigold/60 text-marigold">
          <Check className="size-4" aria-hidden />
        </span>
        <p className="mt-4 font-serif text-h3 text-on-brand">
          {confirmed.alreadySubscribed
            ? "Already on the list."
            : "Subscription confirmed."}
        </p>
        <p className="mt-2 max-w-[42ch] text-small leading-relaxed text-on-brand/70">
          <span className="break-all text-on-brand">{confirmed.email}</span> is
          saved for the monthly dispatch. One letter a month, written after the
          events, not before them.
        </p>
        <button
          type="button"
          onClick={() => setConfirmed(null)}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-marigold underline-offset-4 hover:underline"
        >
          Use a different address
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-[460px]">
      <label
        htmlFor={`${id}-email`}
        className="font-mono text-[10px] uppercase tracking-[0.16em] text-on-brand/60"
      >
        Email address
      </label>

      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
        <Input
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.currentTarget.value);
            if (error) setError(null);
          }}
          disabled={pending}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          className="h-12 border-on-brand/25 bg-paper text-ink placeholder:text-ink-muted/70"
        />
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          aria-busy={pending}
          className="h-12 shrink-0 justify-between border-marigold bg-marigold text-canopy hover:border-on-brand hover:bg-on-brand hover:text-canopy"
        >
          {pending ? "Subscribing…" : "Subscribe"}
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <ArrowRight className="size-4" aria-hidden />
          )}
        </Button>
      </div>

      {error ? (
        <p id={`${id}-error`} className="mt-2.5 text-[12px] leading-5 text-marigold">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="mt-2.5 text-[12px] leading-5 text-on-brand/50">
          One letter a month, when there is one to send. No forwarding, no noise.
        </p>
      )}
    </form>
  );
}

export { NewsletterForm };
