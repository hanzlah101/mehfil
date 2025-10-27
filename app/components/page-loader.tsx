import { Spinner } from "@/components/ui/spinner"

export function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center text-primary">
      <Spinner size="md" />
    </div>
  )
}
