import { EventCalendar } from "@/components/events/calendar"
import { DeleteEventDialog } from "@/components/events/delete-event-dialog"
import { EventModal } from "@/components/events/event-modal"
import { Protected } from "@/components/protected"
import { BRAND_NAME } from "@/lib/constants"

export function meta() {
  return [
    { title: `${BRAND_NAME} - Events` },
    { name: "description", content: "View and manage events in the calendar" }
  ]
}

export default function Events() {
  return (
    <>
      <Protected perm="read:events">
        <EventCalendar />
      </Protected>
      <Protected operator="or" perm={["create:event", "update:event"]}>
        <EventModal />
      </Protected>
      <Protected perm="delete:event">
        <DeleteEventDialog />
      </Protected>
    </>
  )
}
