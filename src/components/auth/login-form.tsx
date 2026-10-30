"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage, safeNextPath } from "@/lib/auth-errors";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[12px] leading-5 text-clay">
      {message}
    </p>
  );
}

function LoginForm({
  nextPath,
  googleEnabled,
  oauthError,
}: {
  nextPath: string;
  googleEnabled: boolean;
  oauthError: boolean;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (oauthError) {
      toast.error("Google sign-in did not complete.", {
        description: "Try again, or use your email and password.",
      });
    }
  }, [oauthError]);

  function onInvalid() {
    toast.error("Check the highlighted fields.", {
      description: "Enter your email and password to sign in.",
    });
  }

  async function onSubmit(values: LoginValues) {    setFormError(null);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      const message = authErrorMessage(error);
      setFormError(message);
      toast.error("Could not sign you in.", { description: message });
      return;
    }

    toast.success("Signed in.", { description: "Your record is open." });
    router.replace(safeNextPath(nextPath));
    router.refresh();
  }

  return (
    <div>
      <p className="font-mono text-eyebrow uppercase text-clay">Members · sign in</p>
      <h1 className="mt-4 font-serif text-h1 text-ink">Pick up your record.</h1>
      <p className="mt-4 max-w-[42ch] text-body text-ink-muted">
        Sign in to create an event, join a neighbour’s, and keep track of the work
        you have already done.
      </p>

      <div className="mt-8">
        <GoogleButton nextPath={nextPath} enabled={googleEnabled} />
      </div>

      <div className="my-7 flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-bark" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
          or use email
        </span>
        <span className="h-px flex-1 bg-bark" />
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="login-email-error" message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <Label htmlFor="login-password">Password</Label>
            <button
              type="button"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={Boolean(errors.password) || undefined}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
          />
          <FieldError id="login-password-error" message={errors.password?.message} />
        </div>

        {formError ? (
          <div
            role="alert"
            className="border-l-2 border-clay bg-clay/5 px-3 py-2.5 text-small leading-relaxed text-clay"
          >
            {formError}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full justify-between" disabled={isSubmitting}>
          <span>{isSubmitting ? "Signing in…" : "Sign in"}</span>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <ArrowRight
              className="size-4 transition-transform group-hover/button:translate-x-0.5"
              aria-hidden
            />
          )}
        </Button>
      </form>

      <p className="mt-7 border-t border-bark pt-5 text-small text-ink-muted">
        New to Communova?{" "}
        <Link
          href={nextPath === "/profile" ? "/register" : `/register?next=${encodeURIComponent(nextPath)}`}
          className={cn("font-medium text-ink underline decoration-bark underline-offset-4 hover:text-clay hover:decoration-clay")}
        >
          Open a record
        </Link>
      </p>
    </div>
  );
}

export { LoginForm };
