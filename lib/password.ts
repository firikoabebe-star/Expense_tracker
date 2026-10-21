export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "min-length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "One special character",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export const PASSWORD_ERROR_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";

export function validatePassword(password: string): {
  valid: boolean;
  failed: string[];
} {
  const failed = PASSWORD_RULES.filter((rule) => !rule.test(password)).map(
    (rule) => rule.id
  );
  return { valid: failed.length === 0, failed };
}

export function getPasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  if (passed <= 1) return 1;
  if (passed === 2) return 2;
  if (passed === 3) return 3;
  return 4;
}
