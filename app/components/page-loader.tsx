import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-svh items-center justify-center text-primary",
        className
      )}
    >
      <Spinner size="md" />
    </div>
  )
}
