import { EventCalendar } from "@/components/events/calendar"
import { EventModal } from "@/components/events/event-modal"

export function meta() {
  return [{ title: "Calendar" }, { name: "description", content: "Calendar" }]
}

export default function Home() {
  return (
    <>
      <EventCalendar />
      <EventModal />
    </>
  )
}
