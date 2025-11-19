import { VenueModal } from "@/components/venues/venue-modal"
import { VenuesList } from "@/components/venues/venues-list"
import { DeleteVenueDialog } from "@/components/venues/delete-venue-dialog"
import { Protected } from "@/components/protected"
import { BRAND_NAME } from "@/lib/constants"

export function meta() {
  return [
    { title: `${BRAND_NAME} - Venues` },
    { name: "description", content: "View and manage event venues" }
  ]
}

export default function Venues() {
  return (
    <Protected perm="read:venues">
      <VenuesList />
      <Protected operator="or" perm={["create:venue", "update:venue"]}>
        <VenueModal />
      </Protected>
      <Protected perm="delete:venue">
        <DeleteVenueDialog />
      </Protected>
    </Protected>
  )
}
