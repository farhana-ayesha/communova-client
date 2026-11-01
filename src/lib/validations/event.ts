import { z } from "zod";
import { EVENT_TYPES } from "@/types/event";

/**
 * Client-side event form rules. The API validates the same fields again in
 * `server/src/modules/events/event.schema.ts`; this copy exists to give
 * immediate, field-level feedback.
 *
 * Creating an event requires a future date. Editing keeps the same rule, with
 * one exception: an event that has already happened may be saved without
 * changing its original minute, so older records stay editable.
 */
const eventFields = z.object({
  title: z
    .string()
    .trim()
    .min(4, "Use at least 4 characters.")
    .max(100, "Use 100 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(20, "Describe the work in at least 20 characters.")
    .max(2000, "Use 2000 characters or fewer."),
  type: z.enum(EVENT_TYPES, { message: "Choose an event type." }),
  thumbnailUrl: z
    .string()
    .trim()
    .min(1, "Add a thumbnail image URL.")
    .max(2048, "That URL is too long.")
    .refine(
      (value) => /^https?:\/\/\S+$/i.test(value),
      "Use a full image URL starting with http:// or https://.",
    ),
  location: z
    .string()
    .trim()
    .min(2, "Add the neighbourhood or meeting point.")
    .max(120, "Use 120 characters or fewer."),
  eventDate: z
    .string()
    .min(1, "Choose the date and time.")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Enter a valid date and time.",
    ),
});

export function createEventFormSchema(originalEventDate?: string) {
  const original = originalEventDate ? Date.parse(originalEventDate) : Number.NaN;

  return eventFields.superRefine((values, context) => {
    const selected = Date.parse(values.eventDate);
    if (Number.isNaN(selected)) return;

    if (selected > Date.now()) return;

    // The API compares stored dates to the minute, so mirror that precision.
    const sameMinute =
      !Number.isNaN(original) &&
      Math.floor(selected / 60_000) === Math.floor(original / 60_000);

    if (sameMinute) return;

    context.addIssue({
      code: "custom",
      path: ["eventDate"],
      message: Number.isNaN(original)
        ? "Choose a date in the future."
        : "Choose a future date, or keep the original time.",
    });
  });
}

export const eventFormSchema = createEventFormSchema();

export type EventFormValues = z.infer<typeof eventFormSchema>;
