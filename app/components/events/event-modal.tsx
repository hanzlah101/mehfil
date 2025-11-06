import { Protected } from "@/components/protected"
import { EventForm } from "@/components/events/event-form"
import { useEventModal } from "@/stores/use-event-modal"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

const modalContent = {
  create: {
    title: "New Event",
    description: "Create a new event, meeting, or reservation entry."
  },
  update: {
    title: "Update Event",
    description: "Modify the details, date, or information of this event."
  }
}

export function EventModal() {
  const { type, isOpen, onClose } = useEventModal()

  const content = type === "create" ? modalContent.create : modalContent.update

  return (
    <Protected perm={type === "create" ? "create:event" : "update:event"}>
      <Drawer
        open={isOpen && (type === "create" || type === "update")}
        onClose={onClose}
      >
        <DrawerContent>
          <div className="overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>{content.title}</DrawerTitle>
              <DrawerDescription>{content.description}</DrawerDescription>
            </DrawerHeader>

            <div className="mx-auto w-full max-w-2xl px-4">
              <EventForm />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Protected>
  )
}
