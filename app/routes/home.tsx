import { EventCalendar } from "@/components/events/calendar"
import { EventModal } from "@/components/events/event-modal"
import { Protected } from "@/components/protected"

export function meta() {
  return [{ title: "Calendar" }, { name: "description", content: "Calendar" }]
}

export default function Home() {
  return (
    <>
      <Protected perm="read:events">
        <EventCalendar />
      </Protected>
      <Protected operator="or" perm={["create:event", "update:event"]}>
        <EventModal />
      </Protected>
    </>
  )
}
