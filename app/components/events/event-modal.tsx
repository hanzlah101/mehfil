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
import { EventBill } from "./event-bill"

const modalContent = {
  create: {
    title: "New Event",
    permission: "create:event",
    description: "Create a new event, meeting, or reservation entry.",
    Component: EventForm
  },
  update: {
    title: "Update Event",
    permission: "update:event",
    description: "Modify the details, date, or information of this event.",
    Component: EventForm
  },
  "print-bill": {
    title: "Print Bill",
    permission: "read:events",
    description: "Print the bill for this event.",
    Component: EventBill
  }
} as const

export function EventModal() {
  const { type, isOpen, onClose } = useEventModal()

  const { permission, title, description, Component } =
    type === "create"
      ? modalContent.create
      : type === "update"
        ? modalContent.update
        : type === "print-bill"
          ? modalContent["print-bill"]
          : modalContent.create

  return (
    <Protected perm={permission}>
      <Drawer open={isOpen && type !== "delete"} onClose={onClose}>
        <DrawerContent>
          <div className="overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>

            <div className="mx-auto w-full max-w-2xl px-4">
              <Component />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Protected>
  )
}
