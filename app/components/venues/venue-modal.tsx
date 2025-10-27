import { useVenueModal } from "@/stores/use-venue-modal"
import { VenueForm } from "@/components/venues/venue-form"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

export function VenueModal() {
  const { isOpen, onClose } = useVenueModal()

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Venue</DrawerTitle>
          <DrawerDescription>
            Create a new venue, hall, or floor within your business location
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-auto w-full max-w-2xl px-4 pb-4">
          <VenueForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
