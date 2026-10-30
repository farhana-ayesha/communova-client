import { z } from "zod";

/**
 * Client-side validation contract. The same rules are mirrored by Better Auth's
 * server-side password policy, so a form cannot bypass them.
 */

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address.");

const password = z
  .string()
  .min(1, "Enter a password.")
  .min(6, "Use at least 6 characters.")
  .max(128, "Use 128 characters or fewer.")
  .regex(/[A-Z]/, "Include at least one uppercase letter.")
  .regex(/[a-z]/, "Include at least one lowercase letter.");

const photoURL = z
  .string()
  .trim()
  .max(2048, "That URL is too long.")
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
    "Use a full image URL starting with http:// or https://.",
  );

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Use at least 2 characters.")
      .max(60, "Use 60 characters or fewer."),
    email,
    photoURL,
    password,
    confirmPassword: z.string().min(1, "Repeat your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
