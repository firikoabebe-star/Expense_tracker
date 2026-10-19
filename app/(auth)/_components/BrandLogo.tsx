import Link from "next/link";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Montra home"
      className={`mx-auto flex w-fit items-center gap-2 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--clr-brand)] text-[15px] font-bold text-[var(--clr-accent)] shadow-sm"
        style={{ fontFamily: "var(--font-display)" }}
      >
        M
      </span>
      <span
        className="text-[17px] font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="text-[var(--clr-brand)] dark:text-[var(--primary)]">
          Montra
        </span>
      </span>
    </Link>
  );
}
