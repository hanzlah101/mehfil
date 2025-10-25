import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { AsteriskIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render a styled label element that can show a required-field indicator.
 *
 * @param required - If `true`, append a red asterisk icon after the label text
 * @returns A Radix `LabelPrimitive.Root` element containing `children` and an optional asterisk when `required` is `true`
 */
function Label({
  children,
  className,
  required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex w-fit items-center text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        required ? "gap-1" : "gap-2",
        className
      )}
      {...props}
    >
      {children}
      {required === true && (
        <AsteriskIcon className="size-3 text-destructive" />
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }