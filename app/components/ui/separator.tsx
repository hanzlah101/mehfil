import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Render a styled separator line that supports horizontal or vertical orientation.
 *
 * @param className - Additional CSS classes applied to the separator container
 * @param orientation - Layout orientation of the separator, either `"horizontal"` or `"vertical"`
 * @param decorative - If `true`, marks the separator as decorative for assistive technologies
 * @returns A configured `SeparatorPrimitive.Root` element with responsive sizing and the provided props
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }