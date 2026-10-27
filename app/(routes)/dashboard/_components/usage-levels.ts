export type UsageLevel = 'safe' | 'watch' | 'over'

/**
 * Budget health thresholds shared by the dashboard widgets: green under 70%,
 * yellow from 70% to 90%, red above 90%.
 */
export function usageLevel(pct: number): UsageLevel {
  if (pct > 90) return 'over'
  if (pct >= 70) return 'watch'
  return 'safe'
}

/** Solid fill for progress bars and status dots. */
export const USAGE_TONE: Record<UsageLevel, string> = {
  safe: 'bg-success',
  watch: 'bg-warning',
  over: 'bg-destructive',
}

/** Copy shown next to the monthly target gauge. */
export const USAGE_LABEL: Record<UsageLevel, string> = {
  safe: 'On track',
  watch: 'Watch spending',
  over: 'Over budget',
}

/**
 * SVG-safe equivalent of USAGE_TONE for chart fills. `--destructive` holds
 * raw HSL channels in the token sheet, so it is wrapped in hsl().
 */
export const USAGE_CHART_FILL: Record<UsageLevel, string> = {
  safe: 'var(--success)',
  watch: 'var(--warning)',
  over: 'hsl(var(--destructive))',
}
