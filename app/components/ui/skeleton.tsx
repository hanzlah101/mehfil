import { cn } from "@/lib/utils"

/**
 * Render a skeleton placeholder element for loading states.
 *
 * @param className - Additional CSS classes to merge with the component's default classes
 * @param props - Additional props forwarded to the underlying div element
 * @returns The skeleton div element with default animation and background classes applied
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }