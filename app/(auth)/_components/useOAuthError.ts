"use client";

import { useEffect } from "react";
import { getGoogleErrorCodeMessage } from "/lib/auth-errors";

/**
 * Reads OAuth errors that better-auth appends to the current URL, shows a
 * friendly message, then removes the error params from the address bar.
 */
export function useOAuthError(setError: (message: string) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("error");
    if (!code) return;

    setError(
      getGoogleErrorCodeMessage(code, params.get("error_description"))
    );

    params.delete("error");
    params.delete("error_description");
    const query = params.toString();

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${
        window.location.hash
      }`
    );
  }, [setError]);
}
