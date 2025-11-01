import { VenueModal } from "@/components/venues/venue-modal"
import { VenuesList } from "@/components/venues/venues-list"
import { DeleteVenueDialog } from "@/components/venues/delete-venue-dialog"

export function meta() {
  return [
    { title: "Calendar - Venues" },
    { name: "description", content: "Calendar - Venues" }
  ]
}

export default function Home() {
  return (
    <>
      <VenuesList />
      <VenueModal />
      <DeleteVenueDialog />
    </>
  )
}
