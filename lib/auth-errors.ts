export type AuthClientError =
  | {
      code?: string;
      message?: string;
      status?: number;
      statusText?: string;
    }
  | null
  | undefined;

const OTP_ERROR_MESSAGES: Record<string, string> = {
  INVALID_OTP: "That code is incorrect. Check the email and try again.",
  OTP_EXPIRED: "That code has expired. Request a new code and try again.",
  TOO_MANY_ATTEMPTS:
    "Too many incorrect attempts. Request a new code and try again.",
};

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  account_not_linked:
    "An account with this email already exists but isn't linked to Google. Sign in with your email and password, then try Google again.",
  email_not_verified:
    "Google hasn't verified this email address. Verify your Google email, then try again.",
  unverified_email:
    "Google hasn't verified this email address. Verify your Google email, then try again.",
  email_not_found:
    "Google didn't share an email address with us. Try another sign-in method.",
  unable_to_link_account:
    "We couldn't link your Google account. Sign in with your email and password, then try again.",
  account_already_linked_to_different_user:
    "This Google account is already linked to a different user.",
  access_denied: "Google sign-in was cancelled.",
  invalid_code: "Google sign-in could not be completed. Please try again.",
  unable_to_get_user_info:
    "We couldn't get your details from Google. Please try again.",
  state_mismatch: "Your sign-in session expired. Please try again.",
};

export function isEmailNotVerified(error: AuthClientError): boolean {
  if (!error) return false;
  const code = (error.code || "").toUpperCase();
  return (
    code === "EMAIL_NOT_VERIFIED" ||
    /email (?:address )?(?:is )?not verified|verify your email/i.test(
      error.message || ""
    )
  );
}

export function getOtpErrorMessage(
  error: AuthClientError,
  fallback = "We couldn't verify that code. Please try again."
): string {
  if (!error) return fallback;
  const code = (error.code || "").toUpperCase();
  return OTP_ERROR_MESSAGES[code] || error.message || fallback;
}

export function getGoogleErrorMessage(error: AuthClientError): string {
  if (!error) {
    return "We couldn't complete Google sign-in. Please try again.";
  }

  const code = (error.code || "").toLowerCase();
  if (GOOGLE_ERROR_MESSAGES[code]) return GOOGLE_ERROR_MESSAGES[code];

  const message = error.message || "";
  if (/not verified|unverified/i.test(message)) {
    return "Google hasn't verified this email address. Verify your Google email, then try again.";
  }
  if (/not linked|already exists/i.test(message)) {
    return GOOGLE_ERROR_MESSAGES.account_not_linked;
  }

  return "We couldn't complete Google sign-in. Please try again.";
}

export function getGoogleErrorCodeMessage(
  code: string,
  description?: string | null
): string {
  return getGoogleErrorMessage({ code, message: description || undefined });
}
