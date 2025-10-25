import { EventForm } from "@/components/events/event-form"
import { useEventModal } from "@/stores/use-event-modal"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

export function EventModal() {
  const { isOpen, onClose } = useEventModal()

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Event</DrawerTitle>
          <DrawerDescription>
            Set up event details, date, and customer info.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 max-w-2xl w-full mx-auto">
          <EventForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
