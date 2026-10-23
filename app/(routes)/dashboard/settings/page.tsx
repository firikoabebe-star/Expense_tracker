"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";

import { authClient } from "/lib/auth-client";
import { getUserAuthAccounts } from "../actions";
import { ChangePasswordCard } from "./_components/ChangePasswordCard";
import { ProfileCard, type SignInProvider } from "./_components/ProfileCard";
import { SettingsSkeleton } from "./_components/SettingsSkeleton";

type AccountRow = { providerId: string };

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await getUserAuthAccounts();
        if (cancelled) return;
        setAccounts(Array.isArray(result) ? result : []);
      } catch {
        if (cancelled) return;
        setAccounts([]);
        setAccountsError(true);
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasCredential = useMemo(
    () => accounts.some((account) => account.providerId === "credential"),
    [accounts]
  );

  const provider: SignInProvider = useMemo(() => {
    if (accountsError) return null;
    const hasGoogle = accounts.some(
      (account) => account.providerId === "google"
    );
    if (hasGoogle && hasCredential) return "google-and-credential";
    if (hasGoogle) return "google";
    if (hasCredential) return "credential";
    return null;
  }, [accounts, accountsError, hasCredential]);

  if (isPending || accountsLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your profile and keep your account secure.
          </p>
        </header>

        <div className="space-y-4">
          <ProfileCard
            name={session?.user?.name}
            email={session?.user?.email}
            provider={provider}
          />

          {accountsError ? (
            <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-destructive">
                  <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-foreground">
                    Couldn&apos;t load security settings
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We couldn&apos;t check your sign-in method. Refresh the page
                    and try again.
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <ChangePasswordCard hasCredential={hasCredential} />
          )}
        </div>
      </div>
    </div>
  );
}
