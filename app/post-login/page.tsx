"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "/lib/auth-client";

export default function PostLoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    const role = (session.user as Record<string, unknown>).role;
    router.replace(role === "admin" ? "/admin" : "/dashboard");
  }, [isPending, session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--clr-bg)] px-4">
      <div className="flex items-center gap-3 text-[var(--clr-text-muted)]">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Signing you in...</span>
      </div>
    </div>
  );
}
