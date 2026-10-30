/**
 * Client mirror of `server/src/modules/events/event.types.ts`.
 * The two projects deploy separately, so the contract is duplicated by design —
 * change both together.
 */
export const EVENT_TYPES = [
  "cleanup",
  "plantation",
  "donation",
  "education",
  "health",
  "other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  cleanup: "Cleanup",
  plantation: "Plantation",
  donation: "Donation",
  education: "Education",
  health: "Health",
  other: "Other",
};

export interface EventDto {
  id: string;
  title: string;
  description: string;
  type: EventType;
  thumbnailUrl: string;
  location: string;
  /** ISO 8601 timestamp. */
  eventDate: string;
  participantCount: number;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
