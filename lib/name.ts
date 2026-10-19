export type NameValidationResult = {
  valid: boolean;
  message: string | null;
  normalized: string;
};

const MIN_WORD_LENGTH = 2;
const MAX_WORD_LENGTH = 30;

// A word: starts and ends with a letter, letters/apostrophes/hyphens inside.
const WORD_PATTERN = /^[\p{L}][\p{L}'-]*[\p{L}]$/u;
const NON_LETTERS_PATTERN = /[^\p{L}]+/gu;

export function validateFullName(name: string): NameValidationResult {
  const normalized = (name ?? "").trim().replace(/\s+/g, " ");

  if (!normalized) {
    return {
      valid: false,
      message: "Enter your first and last name",
      normalized,
    };
  }

  const words = normalized.split(" ");

  if (words.length < 2) {
    return {
      valid: false,
      message: "Enter your first and last name",
      normalized,
    };
  }

  for (const word of words) {
    if (word.length < MIN_WORD_LENGTH || word.length > MAX_WORD_LENGTH) {
      return {
        valid: false,
        message: `Each part of your name must be ${MIN_WORD_LENGTH} to ${MAX_WORD_LENGTH} characters`,
        normalized,
      };
    }

    if (!WORD_PATTERN.test(word)) {
      return {
        valid: false,
        message:
          "Name can only contain letters, spaces, hyphens and apostrophes",
        normalized,
      };
    }
  }

  return { valid: true, message: null, normalized };
}

function capitalizeWord(word: string): string {
  return word
    .split(/([-'])/)
    .map((part) =>
      part === "-" || part === "'" || part.length === 0
        ? part
        : Array.from(part)[0].toLocaleUpperCase() +
          Array.from(part).slice(1).join("").toLocaleLowerCase()
    )
    .join("");
}

export function getFirstName(
  fullName: string | null | undefined
): string {
  const trimmed = (fullName ?? "").trim();
  if (!trimmed) return "there";

  let candidate: string;

  if (trimmed.includes("@")) {
    // Legacy accounts may store an email as the name: keep the local part,
    // stripped of digits and separators.
    candidate = trimmed.split("@")[0].replace(NON_LETTERS_PATTERN, "");
  } else {
    candidate = trimmed.split(/\s+/)[0];
  }

  if (!candidate) return "there";

  return capitalizeWord(candidate);
}
