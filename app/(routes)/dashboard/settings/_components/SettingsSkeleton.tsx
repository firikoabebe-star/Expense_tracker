export function SettingsSkeleton() {
  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 space-y-2" aria-hidden="true">
          <div className="h-8 w-32 animate-pulse rounded-md bg-accent" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-accent" />
        </div>
        <div className="space-y-4">
          <div className="h-56 animate-pulse rounded-lg border border-border bg-card" />
          <div className="h-96 animate-pulse rounded-lg border border-border bg-card" />
        </div>
        <span className="sr-only">Loading settings</span>
      </div>
    </div>
  );
}
