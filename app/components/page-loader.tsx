import { Spinner } from "@/components/ui/spinner"

/**
 * Renders a full-viewport-height centered loading spinner.
 *
 * @returns A JSX element containing a centered Spinner inside a container that spans the viewport height.
 */
export function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner />
    </div>
  )
}