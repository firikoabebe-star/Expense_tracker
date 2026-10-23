import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Visual shell used by every settings section: soft border, small shadow and
 * a circular accent icon. No hover styles — these are static panels, not
 * links. All colors come from semantic tokens so both themes work.
 */
export function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: SettingsCardProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
