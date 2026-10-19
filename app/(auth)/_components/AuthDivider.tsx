export function AuthDivider() {
  return (
    <div className="my-4 flex items-center" aria-hidden="true">
      <div className="h-px flex-1 bg-[var(--clr-border-mid)]" />
      <span className="mx-3 text-xs tracking-wide text-[var(--clr-text-muted)]">
        or
      </span>
      <div className="h-px flex-1 bg-[var(--clr-border-mid)]" />
    </div>
  );
}
