import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root component that provides the sheet context for its children.
 *
 * Renders a Radix Sheet root element with a standardized `data-slot="sheet"` attribute and forwards all received props.
 *
 * @returns The sheet root React element with forwarded props
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

/**
 * Sheet trigger component that forwards props to the underlying trigger element and injects a `data-slot="sheet-trigger"` attribute.
 *
 * @param props - Props to apply to the trigger element; all values are forwarded to the underlying trigger.
 * @returns The rendered trigger element with forwarded props and the `data-slot="sheet-trigger"` attribute.
 */
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/**
 * Renders the sheet's close control with a standardized `data-slot="sheet-close"` and forwards all received props.
 *
 * @returns A React element that serves as the sheet close control.
 */
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

/**
 * Wraps Radix Portal to render sheet content into a portal with a standardized `data-slot`.
 *
 * @returns A Portal element with `data-slot="sheet-portal"` and all forwarded props
 */
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/**
 * Backdrop overlay for the Sheet with preset positioning, backdrop color, and open/close animations.
 *
 * @param className - Additional CSS class names to merge with the component's default overlay styles
 * @returns The rendered overlay element
 */
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Render the sheet's content panel including an overlay, animated entrance/exit, and a built-in close control.
 *
 * The content panel is positioned and animated based on `side`, accepts additional class names, and renders `children` inside.
 *
 * @param className - Additional class names to apply to the content container
 * @param children - Elements to render inside the sheet content
 * @param side - Side of the viewport where the sheet appears: `"top"`, `"right"`, `"bottom"`, or `"left"`. Defaults to `"right"`.
 * @returns A React element containing the sheet content, overlay, and close button
 */
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          side === "top" &&
            "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/**
 * Layout container for a sheet's header area.
 *
 * Renders a div with standardized header spacing and exposes a `data-slot="sheet-header"`.
 *
 * @returns The header container element with applied styles and forwarded props.
 */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

/**
 * Renders a sheet footer container that sticks to the bottom and provides spacing for footer content.
 *
 * @param className - Additional CSS class names merged with the footer's default layout and spacing
 * @returns A `div` element with `data-slot="sheet-footer"` and default footer styles (bottom alignment, padding, and gap)
 */
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled sheet title element.
 *
 * @param className - Additional CSS class names to merge with the component's default typography
 * @returns The sheet title element with preset font weight and foreground color, forwarding all other props
 */
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

/**
 * Renders a sheet description element with preset muted small-text styling.
 *
 * @returns A `SheetPrimitive.Description` element with `text-sm` and `text-muted-foreground` styling, the `data-slot="sheet-description"` attribute, and any forwarded props.
 */
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
}