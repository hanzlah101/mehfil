import { Protected } from "@/components/protected"
import { EventForm } from "@/components/events/event-form"
import { EventBill } from "@/components/events/event-bill"
import { CancelEventForm } from "@/components/events/cancel-event-form"
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
    permission: "create:event",
    description: "Create a new event, meeting, or reservation entry.",
    Component: EventForm
  },
  update: {
    title: (serialCode: string) => `Update Event (#${serialCode})`,
    permission: "update:event",
    description: "Modify the details, date, or information of this event.",
    Component: EventForm
  },
  "print-bill": {
    title: (serialCode: string) => `Print Bill (#${serialCode})`,
    permission: "read:events",
    description: "Print the bill for this event.",
    Component: EventBill
  },
  "cancel-event": {
    title: (serialCode: string) => `Cancel Event (#${serialCode})`,
    permission: "update:event",
    description: "Cancel this event and provide a reason for cancellation.",
    Component: CancelEventForm
  }
} as const

export function EventModal() {
  const { type, isOpen, onClose, event } = useEventModal()

  const { permission, title, description, Component } =
    type === "create"
      ? modalContent.create
      : type === "update"
        ? modalContent.update
        : type === "print-bill"
          ? modalContent["print-bill"]
          : type === "cancel-event"
            ? modalContent["cancel-event"]
            : modalContent.create

  return (
    <Protected perm={permission}>
      <Drawer open={isOpen && type !== "delete"} onClose={onClose}>
        <DrawerContent>
          <div className="overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>
                {typeof title === "function"
                  ? title(event?.serialCode ?? "")
                  : title}
              </DrawerTitle>
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
