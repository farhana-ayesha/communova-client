/** True only when real Google OAuth keys are present, not the `.env` placeholders. */
export function isGoogleConfigured() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";

  if (!clientId || !clientSecret) return false;
  if (clientId.startsWith("replace-me") || clientSecret.startsWith("replace-me")) {
    return false;
  }

  return true;
}
