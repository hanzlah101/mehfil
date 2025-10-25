import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Renders a styled textarea element that accepts native textarea props and an optional className.
 *
 * Merges a set of default utility classes (appearance, spacing, borders, focus/invalid/disabled states, and dark-mode variants) with the provided `className`, forwards all other props to the underlying textarea, and sets `data-slot="textarea"`.
 *
 * @param className - Additional CSS classes to append to the default styling
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content max-h-60 min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }