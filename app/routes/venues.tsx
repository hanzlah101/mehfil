import { RiAddLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { useVenueModal } from "@/stores/use-venue-modal"
import { VenueModal } from "@/components/venues/venue-modal"

export function meta() {
  return [
    { title: "Calendar - Venues" },
    { name: "description", content: "Calendar - Venues" }
  ]
}

export default function Home() {
  const openVenueModal = useVenueModal((s) => s.onOpen)

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">
          Venues (3)
        </h1>
        <Button size="sm" onClick={openVenueModal}>
          <RiAddLine />
          New Venue
        </Button>
      </div>
      <VenueModal />
    </>
  )
}
