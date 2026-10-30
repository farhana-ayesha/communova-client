import { z } from "zod";
import { EVENT_TYPES } from "@/types/event";

/**
 * Client-side event form rules. The API validates the same fields again in
 * `server/src/modules/events/event.schema.ts`; this copy exists to give
 * immediate, field-level feedback.
 */
export const eventFormSchema = z.object({
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
    )
    .refine(
      (value) => new Date(value).getTime() > Date.now(),
      "Choose a date in the future.",
    ),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
