export const VENUE_COLORS = [
  "red",
  "pink",
  "violet",
  "blue",
  "sky",
  "cyan",
  "emerald",
  "lime",
  "amber",
  "orange"
] as const

export type VenueColor = (typeof VENUE_COLORS)[number]

const COLOR_CLASSES = {
  red: "bg-red-200/50 hover:bg-red-200/40 text-red-950/80 dark:bg-red-400/25 dark:hover:bg-red-400/20 dark:text-red-200 shadow-red-700/8",
  pink: "bg-pink-200/50 hover:bg-pink-200/40 text-pink-950/80 dark:bg-pink-400/25 dark:hover:bg-pink-400/20 dark:text-pink-200 shadow-pink-700/8",
  violet:
    "bg-violet-200/50 hover:bg-violet-200/40 text-violet-950/80 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/8",
  blue: "bg-blue-200/50 hover:bg-blue-200/40 text-blue-950/80 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/8",
  sky: "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8",
  cyan: "bg-cyan-200/50 hover:bg-cyan-200/40 text-cyan-950/80 dark:bg-cyan-400/25 dark:hover:bg-cyan-400/20 dark:text-cyan-200 shadow-cyan-700/8",
  emerald:
    "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-950/80 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8",
  lime: "bg-lime-200/50 hover:bg-lime-200/40 text-lime-950/80 dark:bg-lime-400/25 dark:hover:bg-lime-400/20 dark:text-lime-200 shadow-lime-700/8",
  amber:
    "bg-amber-200/50 hover:bg-amber-200/40 text-amber-950/80 dark:bg-amber-400/25 dark:hover:bg-amber-400/20 dark:text-amber-200 shadow-amber-700/8",
  orange:
    "bg-orange-200/50 hover:bg-orange-200/40 text-orange-950/80 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/8"
}

export function getEventColorClasses(color: string) {
  return COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] ?? COLOR_CLASSES.sky
}
