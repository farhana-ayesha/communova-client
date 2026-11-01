import assert from "node:assert/strict";
import test from "node:test";
import { safeNextPath } from "../lib/auth-errors";
import {
  loginSchema,
  profileSchema,
  registerSchema,
} from "../lib/validations/auth";

const validRegistration = {
  name: "Ayesha Rahman",
  email: "ayesha@example.com",
  photoURL: "https://example.com/portrait.jpg",
  password: "GoodPass1",
  confirmPassword: "GoodPass1",
};

test("registration accepts a strong password and optional photo", () => {
  const result = registerSchema.safeParse(validRegistration);
  assert.equal(result.success, true);

  const withoutPhoto = registerSchema.safeParse({
    ...validRegistration,
    photoURL: "",
  });
  assert.equal(withoutPhoto.success, true);
});

test("registration rejects weak passwords", () => {
  for (const password of ["short1", "alllowercase1", "ALLUPPERCASE1"]) {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password,
      confirmPassword: password,
    });
    assert.equal(result.success, false, `expected ${password} to be rejected`);
  }
});

test("registration rejects mismatched passwords and malformed emails", () => {
  const mismatch = registerSchema.safeParse({
    ...validRegistration,
    confirmPassword: "Different1",
  });
  assert.equal(mismatch.success, false);

  const badEmail = registerSchema.safeParse({
    ...validRegistration,
    email: "not-an-email",
  });
  assert.equal(badEmail.success, false);
});

test("login only requires a non-empty password", () => {
  assert.equal(
    loginSchema.safeParse({
      email: "ayesha@example.com",
      password: "x",
    }).success,
    true,
  );
  assert.equal(
    loginSchema.safeParse({ email: "ayesha@example.com", password: "" }).success,
    false,
  );
});

test("profile edits validate the display name and photo URL", () => {
  assert.equal(
    profileSchema.safeParse({ name: "Ayesha Rahman", photoURL: "" }).success,
    true,
  );
  assert.equal(
    profileSchema.safeParse({ name: "A", photoURL: "" }).success,
    false,
  );
  assert.equal(
    profileSchema.safeParse({
      name: "Ayesha Rahman",
      photoURL: "javascript:alert(1)",
    }).success,
    false,
  );
});

test("safeNextPath keeps same-site paths and rejects redirects", () => {
  assert.equal(safeNextPath("/joined-events"), "/joined-events");
  assert.equal(safeNextPath("/events/abc?from=profile"), "/events/abc?from=profile");
  assert.equal(safeNextPath("https://example.com"), "/profile");
  assert.equal(safeNextPath("//example.com"), "/profile");
  assert.equal(safeNextPath("/\\example.com"), "/profile");
  assert.equal(safeNextPath("/login"), "/profile");
  assert.equal(safeNextPath("/register?next=/events"), "/profile");
  assert.equal(safeNextPath(null), "/profile");
  assert.equal(safeNextPath(undefined, "/events"), "/events");
});
