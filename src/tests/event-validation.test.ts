import assert from "node:assert/strict";
import test from "node:test";
import {
  createEventFormSchema,
  eventFormSchema,
  type EventFormValues,
} from "../lib/validations/event";

const base: EventFormValues = {
  title: "Winter clothes collection",
  description: "Collecting warm jackets and blankets for families in Mirpur 10.",
  type: "donation",
  thumbnailUrl: "https://example.com/event.jpg",
  location: "Mirpur 10 Roundabout, Dhaka",
  eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

test("a new event needs a future date", () => {
  assert.equal(eventFormSchema.safeParse(base).success, true);

  const past = eventFormSchema.safeParse({
    ...base,
    eventDate: "2020-01-15T10:30:00.000Z",
  });
  assert.equal(past.success, false);
});

test("an existing event keeps its original past minute", () => {
  const original = "2020-01-15T10:30:00.000Z";
  const schema = createEventFormSchema(original);

  assert.equal(schema.safeParse({ ...base, eventDate: original }).success, true);

  const differentPast = schema.safeParse({
    ...base,
    eventDate: "2020-01-15T11:30:00.000Z",
  });
  assert.equal(differentPast.success, false);
});

test("an existing event can be moved into the future", () => {
  const schema = createEventFormSchema("2020-01-15T10:30:00.000Z");
  assert.equal(schema.safeParse(base).success, true);
});

test("invalid dates and malformed fields are rejected", () => {
  assert.equal(
    eventFormSchema.safeParse({ ...base, eventDate: "not-a-date" }).success,
    false,
  );
  assert.equal(
    eventFormSchema.safeParse({ ...base, thumbnailUrl: "javascript:alert(1)" })
      .success,
    false,
  );
  assert.equal(
    eventFormSchema.safeParse({ ...base, description: "too short" }).success,
    false,
  );
  assert.equal(
    eventFormSchema.safeParse({ ...base, type: "unknown" }).success,
    false,
  );
});
