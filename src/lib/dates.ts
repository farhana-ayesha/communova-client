const TIME_ZONE = "Asia/Dhaka";

const weekdayShort = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  timeZone: TIME_ZONE,
});
const weekdayLong = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  timeZone: TIME_ZONE,
});
const dayNumber = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  timeZone: TIME_ZONE,
});
const dayPadded = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  timeZone: TIME_ZONE,
});
const monthShort = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  timeZone: TIME_ZONE,
});
const monthLong = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  timeZone: TIME_ZONE,
});
const yearNumber = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  timeZone: TIME_ZONE,
});

export type EventDateParts = {
  weekday: string;
  weekdayLong: string;
  day: string;
  dayPadded: string;
  month: string;
  monthLong: string;
  year: string;
  /** "Sat 7 Nov" */
  short: string;
  /** "Saturday, 7 November 2026" */
  long: string;
};

/** Dates are stored as instants and always read in Dhaka, where the work happens. */
export function eventDateParts(iso: string): EventDateParts | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const parts = {
    weekday: weekdayShort.format(date),
    weekdayLong: weekdayLong.format(date),
    day: dayNumber.format(date),
    dayPadded: dayPadded.format(date),
    month: monthShort.format(date),
    monthLong: monthLong.format(date),
    year: yearNumber.format(date),
  };

  return {
    ...parts,
    short: `${parts.weekday} ${parts.day} ${parts.month}`,
    long: `${parts.weekdayLong}, ${parts.day} ${parts.monthLong} ${parts.year}`,
  };
}

export function isPastEvent(iso: string): boolean {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

/** Relative label used on register cards, e.g. "in 6 days". */
export function daysUntil(iso: string): number {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

/**
 * `datetime-local` speaks the browser's local clock with no zone suffix. This
 * converts a stored instant into the value the input expects, and back again on
 * submit via `new Date(value).toISOString()`.
 */
export function toDateTimeLocal(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

/** Splits a mixed list into future and past entries without re-sorting it. */
export function splitByDate<T extends { eventDate: string }>(
  items: T[],
): { upcoming: T[]; past: T[] } {
  const upcoming: T[] = [];
  const past: T[] = [];

  for (const item of items) {
    if (isPastEvent(item.eventDate)) past.push(item);
    else upcoming.push(item);
  }

  return { upcoming, past };
}
