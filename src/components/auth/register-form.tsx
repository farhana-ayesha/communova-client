"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage, safeNextPath } from "@/lib/auth-errors";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const rules = [
  { key: "length", label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { key: "upper", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { key: "lower", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
] as const;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[12px] leading-5 text-clay">
      {message}
    </p>
  );
}

function RegisterForm({
  nextPath,
  googleEnabled,
}: {
  nextPath: string;
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  function onInvalid() {
    toast.error("Check the highlighted fields.", {
      description: "Use 6+ characters with at least one uppercase and one lowercase letter.",
    });
  }

  async function onSubmit(values: RegisterValues) {
    setFormError(null);

    const { error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      image: values.photoURL.trim() || undefined,
    });

    if (error) {
      const message = authErrorMessage(error);
      setFormError(message);
      toast.error("Could not open your record.", { description: message });
      return;
    }

    toast.success("Your record is open.", {
      description: "Welcome to Communova. Start with an event near you.",
    });
    router.replace(safeNextPath(nextPath));
    router.refresh();
  }

  return (
    <div>
      <p className="font-mono text-eyebrow uppercase text-clay">Members · register</p>
      <h1 className="mt-4 font-serif text-h1 text-ink">Open a record.</h1>
      <p className="mt-4 max-w-[42ch] text-body text-ink-muted">
        One account is enough to create a service event, join one nearby, and keep
        a list of everything you have shown up for.
      </p>

      <div className="mt-8">
        <GoogleButton
          nextPath={nextPath}
          enabled={googleEnabled}
          label="Register with Google"
        />
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
          <Label htmlFor="register-name">Full name</Label>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Ayesha Rahman"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            {...register("name")}
          />
          <FieldError id="register-name-error" message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="register-email-error" message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-photo">Photo URL</Label>
          <Input
            id="register-photo"
            type="url"
            autoComplete="photo"
            placeholder="https://example.com/portrait.jpg"
            aria-invalid={Boolean(errors.photoURL) || undefined}
            aria-describedby={
              errors.photoURL ? "register-photo-error" : "register-photo-hint"
            }
            {...register("photoURL")}
          />
          {errors.photoURL ? (
            <FieldError id="register-photo-error" message={errors.photoURL.message} />
          ) : (
            <p id="register-photo-hint" className="text-[12px] leading-5 text-ink-muted">
              Optional. A square portrait works best; leave it blank to use your initials.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <Label htmlFor="register-password">Password</Label>
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
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={Boolean(errors.password) || undefined}
            aria-describedby="register-password-rules"
            {...register("password")}
          />
          <ul
            id="register-password-rules"
            className="grid gap-1.5 pt-1"
            aria-label="Password requirements"
          >
            {rules.map((rule) => {
              const met = rule.test(password);
              return (
                <li
                  key={rule.key}
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]",
                    met ? "text-fern" : "text-ink-muted",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-[1px]",
                      met ? "bg-fern" : "bg-bark",
                    )}
                  />
                  {rule.label}
                </li>
              );
            })}
          </ul>
          <FieldError id="register-password-error" message={errors.password?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-confirm">Confirm password</Label>
          <Input
            id="register-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={Boolean(errors.confirmPassword) || undefined}
            aria-describedby={
              errors.confirmPassword ? "register-confirm-error" : undefined
            }
            {...register("confirmPassword")}
          />
          <FieldError id="register-confirm-error" message={errors.confirmPassword?.message} />
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
          <span>{isSubmitting ? "Opening your record…" : "Create account"}</span>
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
        Already have a record?{" "}
        <Link
          href={nextPath === "/profile" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`}
          className="font-medium text-ink underline decoration-bark underline-offset-4 hover:text-clay hover:decoration-clay"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export { RegisterForm };
