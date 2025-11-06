import { useVenueModal } from "@/stores/use-venue-modal"
import { VenueForm } from "@/components/venues/venue-form"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

const modalContent = {
  create: {
    title: "New Venue",
    description:
      "Create a new venue, hall, or floor within your business location"
  },
  update: {
    title: "Update Venue",
    description: "Modify the details of your existing venue"
  }
}

export function VenueModal() {
  const { type, isOpen, onClose } = useVenueModal()

  const content = type === "update" ? modalContent.update : modalContent.create

  return (
    <Drawer
      onClose={onClose}
      open={isOpen && (type === "create" || type === "update")}
    >
      <DrawerContent>
        <div className="overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{content.title}</DrawerTitle>
            <DrawerDescription>{content.description}</DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto w-full max-w-2xl px-4 pb-4">
            <VenueForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
