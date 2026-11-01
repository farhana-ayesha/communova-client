"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isPastEvent } from "@/lib/dates";
import {
  ApiError,
  SignInRequiredError,
  createEventRequest,
  updateEventRequest,
} from "@/lib/events-client";
import {
  createEventFormSchema,
  type EventFormValues,
} from "@/lib/validations/event";
import { EVENT_TYPE_LABELS, EVENT_TYPES } from "@/types/event";

const FIELD_KEYS = new Set<keyof EventFormValues>([
  "title",
  "description",
  "type",
  "thumbnailUrl",
  "location",
  "eventDate",
]);

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[12px] leading-5 text-clay">
      {message}
    </p>
  );
}

function EventForm({
  mode,
  eventId,
  originalEventDate,
  defaultValues,
}: {
  mode: "create" | "edit";
  eventId?: string;
  /** Stored ISO date of the event being edited; absent when creating. */
  originalEventDate?: string;
  defaultValues: EventFormValues;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [previewBroken, setPreviewBroken] = useState(false);

  const schema = useMemo(
    () => createEventFormSchema(mode === "edit" ? originalEventDate : undefined),
    [mode, originalEventDate],
  );
  const editingPastEvent = Boolean(
    mode === "edit" && originalEventDate && isPastEvent(originalEventDate),
  );

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const thumbnail = useWatch({ control, name: "thumbnailUrl" });
  const showPreview =
    /^https?:\/\/\S+/i.test(thumbnail) && !previewBroken;

  function onInvalid() {
    toast.error("Check the highlighted fields.", {
      description: editingPastEvent
        ? "Every field is required; keep the original time or move the event into the future."
        : "Every field is required, and the date must still be ahead.",
    });
  }

  async function onSubmit(values: EventFormValues) {
    setFormError(null);

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      type: values.type,
      thumbnailUrl: values.thumbnailUrl.trim(),
      location: values.location.trim(),
      eventDate: new Date(values.eventDate).toISOString(),
    };

    try {
      const event =
        mode === "create"
          ? await createEventRequest(payload)
          : await updateEventRequest(eventId ?? "", payload);

      toast.success(
        mode === "create" ? "Event published." : "Event updated.",
        {
          description:
            mode === "create"
              ? "It is now on the public register."
              : "The register shows the new details.",
        },
      );

      router.push(mode === "create" ? "/events" : `/events/${event.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof SignInRequiredError) {
        toast.error("Sign in again to save this event.", {
          description: "Your session expired while the form was open.",
        });
        const next =
          mode === "create"
            ? "/create-event"
            : `/manage-events/${eventId ?? ""}/edit`;
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      if (error instanceof ApiError) {
        const details = error.details as
          | { fieldErrors?: Record<string, string[] | undefined> }
          | undefined;

        let marked = false;
        for (const [field, messages] of Object.entries(
          details?.fieldErrors ?? {},
        )) {
          const key = field as keyof EventFormValues;
          if (FIELD_KEYS.has(key) && messages?.[0]) {
            setError(key, { message: messages[0] });
            marked = true;
          }
        }

        if (marked) {
          toast.error("Check the highlighted fields.", {
            description: error.message,
          });
          return;
        }

        setFormError(error.message);
        toast.error("Could not save the event.", {
          description: error.message,
        });
        return;
      }

      toast.error("Could not save the event.", {
        description: "Check your connection and try again.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="grid gap-8 lg:grid-cols-12 lg:gap-10"
    >
      <div className="space-y-6 lg:col-span-7">
        <div className="space-y-2">
          <Label htmlFor="event-title">Title</Label>
          <Input
            id="event-title"
            placeholder="Winter Clothes Distribution — Mirpur 10"
            aria-invalid={Boolean(errors.title) || undefined}
            aria-describedby={errors.title ? "event-title-error" : undefined}
            {...register("title")}
          />
          <FieldError id="event-title-error" message={errors.title?.message} />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <Label htmlFor="event-description">Description</Label>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              What to bring, who it helps
            </span>
          </div>
          <Textarea
            id="event-description"
            rows={7}
            placeholder="We are sorting and handing out warm jackets and blankets to families in Mirpur 10. Bring one clean winter item if you can, or come and help with the queue and the packing."
            aria-invalid={Boolean(errors.description) || undefined}
            aria-describedby={
              errors.description ? "event-description-error" : undefined
            }
            {...register("description")}
          />
          <FieldError
            id="event-description-error"
            message={errors.description?.message}
          />
        </div>

        <div className="border border-bark bg-card p-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-4 text-clay" aria-hidden />
            <h2 className="text-small font-medium text-ink">Thumbnail</h2>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="event-thumbnail">Image URL</Label>
            <Input
              id="event-thumbnail"
              inputMode="url"
              placeholder="https://images.unsplash.com/…"
              aria-invalid={Boolean(errors.thumbnailUrl) || undefined}
              aria-describedby={
                errors.thumbnailUrl
                  ? "event-thumbnail-error"
                  : "event-thumbnail-hint"
              }
              {...register("thumbnailUrl", {
                onChange: () => setPreviewBroken(false),
              })}
            />
            <FieldError
              id="event-thumbnail-error"
              message={errors.thumbnailUrl?.message}
            />
            <p
              id="event-thumbnail-hint"
              className="text-[12px] leading-5 text-ink-muted"
            >
              Use a landscape photograph you took or have permission to publish.
              Do not post images of people who have not agreed to appear.
            </p>
          </div>

          <div className="mt-4 border border-bark bg-sand">
            <div className="relative aspect-[16/9] max-h-[340px] overflow-hidden">
              {showPreview ? (
                /* Member-supplied URLs stay plain `<img>` so any host works. */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={thumbnail}
                  alt="Thumbnail preview"
                  className="size-full object-cover"
                  onError={() => setPreviewBroken(true)}
                />
              ) : (
                <div className="grid size-full place-items-center px-6 text-center">
                  <div>
                    <ImageIcon
                      className="mx-auto size-6 text-ink-muted"
                      aria-hidden
                    />
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                      {previewBroken
                        ? "That image could not be loaded"
                        : "Image preview"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-5 lg:col-span-5">
        <div className="border border-bark bg-card p-5">
          <h2 className="text-small font-medium text-ink">The record</h2>
          <p className="mt-1 text-[12px] leading-5 text-ink-muted">
            These details decide where the event appears in the register.
          </p>

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="event-type">Kind of work</Label>
              <Select
                id="event-type"
                aria-invalid={Boolean(errors.type) || undefined}
                aria-describedby={errors.type ? "event-type-error" : undefined}
                {...register("type")}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {EVENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
              <FieldError id="event-type-error" message={errors.type?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-date">
                <CalendarDays className="size-3.5 text-ink-muted" aria-hidden />
                Date and time
              </Label>
              <Input
                id="event-date"
                type="datetime-local"
                aria-invalid={Boolean(errors.eventDate) || undefined}
                aria-describedby={
                  errors.eventDate ? "event-date-error" : "event-date-hint"
                }
                {...register("eventDate")}
              />
              <FieldError
                id="event-date-error"
                message={errors.eventDate?.message}
              />
              <p
                id="event-date-hint"
                className="text-[12px] leading-5 text-ink-muted"
              >
                {editingPastEvent
                  ? "This event has already happened. Keep its original time, or move it into the future."
                  : "New events need a future date. Times are shown in Dhaka on the public pages."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-location">
                <MapPin className="size-3.5 text-ink-muted" aria-hidden />
                Where
              </Label>
              <Input
                id="event-location"
                placeholder="Mirpur 10 Roundabout, Dhaka"
                aria-invalid={Boolean(errors.location) || undefined}
                aria-describedby={
                  errors.location ? "event-location-error" : undefined
                }
                {...register("location")}
              />
              <FieldError
                id="event-location-error"
                message={errors.location?.message}
              />
            </div>
          </div>
        </div>

        <div className="border-l-2 border-marigold pl-4">
          <p className="text-[12px] leading-5 text-ink-muted">
            Published under your name. You can edit or delete the event later
            from{" "}
            <Link
              href="/manage-events"
              className="text-ink underline decoration-bark underline-offset-4 hover:text-clay"
            >
              Manage events
            </Link>
            .
          </p>
        </div>
      </aside>

      <div className="lg:col-span-12">
        {formError ? (
          <div
            role="alert"
            className="mb-5 border-l-2 border-clay bg-clay/5 px-3 py-2.5 text-small leading-relaxed text-clay"
          >
            {formError}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-bark pt-6 sm:flex-row sm:items-center">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="justify-between sm:min-w-[220px]"
          >
            <span>
              {isSubmitting
                ? mode === "create"
                  ? "Publishing…"
                  : "Saving…"
                : mode === "create"
                  ? "Publish event"
                  : "Save changes"}
            </span>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
          </Button>

          <Button asChild variant="ghost" size="lg">
            <Link href={mode === "create" ? "/manage-events" : `/events/${eventId}`}>
              Cancel
            </Link>
          </Button>

          <p className="text-[12px] leading-5 text-ink-muted sm:ml-auto sm:max-w-[30ch] sm:text-right">
            Events stay public after they pass; only upcoming dates appear in the
            main register.
          </p>
        </div>
      </div>
    </form>
  );
}

export { EventForm };
