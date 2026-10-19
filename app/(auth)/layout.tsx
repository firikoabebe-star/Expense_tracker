import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[var(--clr-bg)] px-4 py-10">
      <div className="w-full max-w-[420px] rounded-lg border border-[var(--clr-border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </section>
  );
}
