import { convexQuery } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useVenueModal } from "@/stores/use-venue-modal"
import { VenueItem } from "./venue-item"
import { RiAddLine } from "@remixicon/react"
import { Protected } from "@/components/protected"

export function VenuesList() {
  const openVenueModal = useVenueModal((s) => s.onOpen)
  const { data, isLoading } = useQuery(convexQuery(api.venues.list, {}))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">
          Venues (
          {isLoading ? (
            <Skeleton asChild className="mx-0.5 h-9">
              <span>&nbsp;</span>
            </Skeleton>
          ) : (
            data?.length
          )}
          )
        </h1>
        <Protected perm="create:venue">
          <Button size="sm" onClick={() => openVenueModal("create")}>
            <RiAddLine />
            New Venue
          </Button>
        </Protected>
      </div>

      <ul className="grid w-full gap-3 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <VenueItem.Skeleton key={i} />
            ))
          : data?.map((venue) => <VenueItem key={venue._id} {...venue} />)}
      </ul>
    </div>
  )
}
