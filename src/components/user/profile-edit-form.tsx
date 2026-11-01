"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Avatar } from "@/components/user/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { clearViewerToken } from "@/lib/events-client";
import { profileSchema, type ProfileValues } from "@/lib/validations/auth";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[12px] leading-5 text-clay">
      {message}
    </p>
  );
}

/**
 * The display name and photo URL live on the Better Auth user record. Updating
 * them rotates the session cookie, so the cached API token is discarded and the
 * server components are refreshed to show the new identity immediately.
 */
function ProfileEditForm({
  name,
  image,
}: {
  name: string;
  image: string | null;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, photoURL: image ?? "" },
  });

  const watchedName = useWatch({ control, name: "name" });
  const watchedPhoto = useWatch({ control, name: "photoURL" });

  async function onSubmit(values: ProfileValues) {
    setFormError(null);

    const nextName = values.name.trim();
    const nextPhoto = values.photoURL.trim();

    const { error } = await authClient.updateUser({
      name: nextName,
      image: nextPhoto || null,
    });

    if (error) {
      const message = authErrorMessage(error);
      setFormError(message);
      toast.error("Could not update your record.", { description: message });
      return;
    }

    clearViewerToken();
    reset({ name: nextName, photoURL: nextPhoto });
    toast.success("Record updated.", {
      description: "Your name and photo now appear on the events you publish.",
    });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 border-t border-bark pt-5">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          user={{ name: watchedName || name, image: watchedPhoto || null }}
          size="lg"
        />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            Edit your record
          </p>
          <p className="mt-1 text-[12px] leading-5 text-ink-muted">
            Changes appear on every event you organise.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Display name</Label>
          <Input
            id="profile-name"
            type="text"
            autoComplete="name"
            placeholder="Ayesha Rahman"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            {...register("name")}
          />
          <FieldError id="profile-name-error" message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-photo">Photo URL</Label>
          <Input
            id="profile-photo"
            type="url"
            autoComplete="photo"
            placeholder="https://example.com/portrait.jpg"
            aria-invalid={Boolean(errors.photoURL) || undefined}
            aria-describedby={
              errors.photoURL ? "profile-photo-error" : "profile-photo-hint"
            }
            {...register("photoURL")}
          />
          {errors.photoURL ? (
            <FieldError id="profile-photo-error" message={errors.photoURL.message} />
          ) : (
            <p id="profile-photo-hint" className="text-[12px] leading-5 text-ink-muted">
              Leave blank to use your initials.
            </p>
          )}
        </div>
      </div>

      {formError ? (
        <div
          role="alert"
          className="mt-4 border-l-2 border-clay bg-clay/5 px-3 py-2.5 text-small leading-relaxed text-clay"
        >
          {formError}
        </div>
      ) : null}

      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-5 justify-between"
      >
        {isSubmitting ? "Saving…" : "Save changes"}
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Save className="size-4" aria-hidden />
        )}
      </Button>
    </form>
  );
}

export { ProfileEditForm };
