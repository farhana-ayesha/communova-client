/**
 * Maps Better Auth's error codes to copy a person can act on.
 * The raw message is the fallback so new codes still surface something.
 */
export function authErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return "Something went wrong. Try again.";

  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "That email and password do not match an account.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "An account with this email already exists. Sign in instead.";
    case "PASSWORD_TOO_SHORT":
      return "Use at least 6 characters.";
    case "PASSWORD_TOO_LONG":
      return "Use 128 characters or fewer.";
    case "INVALID_EMAIL":
      return "Enter a valid email address.";
    case "EMAIL_NOT_VERIFIED":
      return "Verify your email before signing in.";
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Wait a minute and try again.";
    case "PROVIDER_NOT_FOUND":
      return "That sign-in provider is not configured.";
    default:
      return error.message?.trim() || "Something went wrong. Try again.";
  }
}

/**
 * Only same-site paths are accepted for post-auth navigation, so `?next=` can
 * never be used as an open redirect.
 */
export function safeNextPath(value: string | null | undefined, fallback = "/profile") {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
