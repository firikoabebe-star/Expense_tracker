import { Chrome, Mail, UserRound } from "lucide-react";

import { SettingsCard } from "./SettingsCard";

export type SignInProvider =
  | "google"
  | "credential"
  | "google-and-credential"
  | null;

interface ProfileCardProps {
  name?: string | null;
  email?: string | null;
  provider: SignInProvider;
}

const PROVIDER_BADGES = {
  google: { label: "Signed in with Google", icon: Chrome },
  credential: { label: "Signed in with email", icon: Mail },
  "google-and-credential": {
    label: "Signed in with Google and email",
    icon: Mail,
  },
} as const;

function getInitial(name?: string | null, email?: string | null): string {
  const source = (name ?? "").trim() || (email ?? "").trim();
  const first = Array.from(source)[0];
  return first ? first.toLocaleUpperCase() : "?";
}

export function ProfileCard({ name, email, provider }: ProfileCardProps) {
  const displayName = (name ?? "").trim() || "Montra member";
  const displayEmail = (email ?? "").trim() || "No email on file";
  const badge = provider ? PROVIDER_BADGES[provider] : null;
  const BadgeIcon = badge?.icon;

  return (
    <SettingsCard
      icon={UserRound}
      title="Profile"
      description="The details tied to your Montra account."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
          >
            {getInitial(name, email)}
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold text-foreground"
              title={displayName}
            >
              {displayName}
            </p>
            <p
              className="truncate text-sm text-muted-foreground"
              title={displayEmail}
            >
              {displayEmail}
            </p>
          </div>
        </div>

        {badge && BadgeIcon ? (
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-border bg-accent px-2.5 py-1 text-xs font-medium text-foreground">
            <BadgeIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {badge.label}
          </span>
        ) : null}
      </div>
    </SettingsCard>
  );
}
