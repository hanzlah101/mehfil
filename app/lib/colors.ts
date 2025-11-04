import colors from "tailwindcss/colors"

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

export function getEventColorStyles(color: string) {
  const eventColor = (
    VENUE_COLORS.includes(color as VenueColor) ? color : "sky"
  ) as VenueColor

  return {
    "--bg-light": colors[eventColor][200],
    "--bg-dark": colors[eventColor][400],
    "--text-light": colors[eventColor][950],
    "--text-dark": colors[eventColor][200],
    "--color-shadow": colors[eventColor][700]
  } as React.CSSProperties
}

export const EVENT_COLOR_CLASSES = [
  "bg-(--bg-light)/50 text-(--text-light)/80 shadow-(--color-shadow)/8",
  "dark:bg-(--bg-dark)/25 dark:text-(--text-dark)",
  "hover:bg-(--bg-light)/40 dark:hover:bg-(--bg-dark)/20"
]

export function getVenueColorStyles(color: VenueColor) {
  return {
    "--color": colors[color][400]
  } as React.CSSProperties
}

export const VENUE_COLOR_CLASSES =
  "bg-(--color) data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-background data-[state=checked]:ring-(--color)"
