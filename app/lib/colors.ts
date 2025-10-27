export const VENUE_COLORS = [
  "sky",
  "red",
  "pink",
  "violet",
  "emerald",
  "yellow",
  "blue",
  "fuchsia",
  "neutral",
  "orange"
] as const

export type VenueColor = (typeof VENUE_COLORS)[number]

const EVENT_COLOR_CLASSES: Record<VenueColor, string> = {
  red: "bg-red-200/50 hover:bg-red-200/40 text-red-950/80 dark:bg-red-400/25 dark:hover:bg-red-400/20 dark:text-red-200 shadow-red-700/8",
  pink: "bg-pink-200/50 hover:bg-pink-200/40 text-pink-950/80 dark:bg-pink-400/25 dark:hover:bg-pink-400/20 dark:text-pink-200 shadow-pink-700/8",
  violet:
    "bg-violet-200/50 hover:bg-violet-200/40 text-violet-950/80 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/8",
  blue: "bg-blue-200/50 hover:bg-blue-200/40 text-blue-950/80 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 shadow-blue-700/8",
  sky: "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8",
  fuchsia:
    "bg-fuchsia-200/50 hover:bg-fuchsia-200/40 text-fuchsia-950/80 dark:bg-fuchsia-400/25 dark:hover:bg-fuchsia-400/20 dark:text-fuchsia-200 shadow-fuchsia-700/8",
  emerald:
    "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-950/80 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8",
  yellow:
    "bg-yellow-200/50 hover:bg-yellow-200/40 text-yellow-950/80 dark:bg-yellow-400/25 dark:hover:bg-yellow-400/20 dark:text-yellow-200 shadow-yellow-700/8",
  neutral:
    "bg-neutral-200/50 hover:bg-neutral-200/40 text-neutral-950/80 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/20 dark:text-neutral-200 shadow-neutral-700/8",
  orange:
    "bg-orange-200/50 hover:bg-orange-200/40 text-orange-950/80 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/8"
}

export function getEventColorClasses(color: string) {
  return EVENT_COLOR_CLASSES[color as VenueColor] ?? EVENT_COLOR_CLASSES.sky
}

const VENUE_COLOR_CLASSES: Record<VenueColor, string> = {
  red: "bg-red-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-red-400",
  pink: "bg-pink-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-pink-400",
  violet:
    "bg-violet-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-violet-400",
  blue: "bg-blue-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-blue-400",
  sky: "bg-sky-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-sky-400",
  fuchsia:
    "bg-fuchsia-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-fuchsia-400",
  emerald:
    "bg-emerald-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-emerald-400",
  yellow:
    "bg-yellow-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-yellow-400",
  neutral:
    "bg-neutral-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-neutral-400",
  orange:
    "bg-orange-400 data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-orange-400"
}

export function getVenueColorClasses(color: VenueColor) {
  return VENUE_COLOR_CLASSES[color]
}
