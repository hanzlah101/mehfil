import { VenueModal } from "@/components/venues/venue-modal"
import { VenuesList } from "@/components/venues/venues-list"
import { DeleteVenueDialog } from "@/components/venues/delete-venue-dialog"
import { Protected } from "@/components/protected"

export function meta() {
  return [
    { title: "Calendar - Venues" },
    { name: "description", content: "Calendar - Venues" }
  ]
}

export default function Home() {
  return (
    <>
      <Protected perm="read:venues">
        <VenuesList />
      </Protected>
      <Protected operator="or" perm={["create:venue", "update:venue"]}>
        <VenueModal />
      </Protected>
      <Protected perm="delete:venue">
        <DeleteVenueDialog />
      </Protected>
    </>
  )
}
