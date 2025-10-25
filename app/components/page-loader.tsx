import { Spinner } from "@/components/ui/spinner"

export function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-svh">
      <Spinner />
    </div>
  )
}
