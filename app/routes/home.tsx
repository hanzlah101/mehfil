import { AppSidebar } from "@/components/app-sidebar"
import { AuthWrapper } from "@/components/auth-wrapper"
import { EventCalendar } from "@/components/events/calendar"
import { EventModal } from "@/components/events/event-modal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

/**
 * Provide HTML metadata for the Calendar page.
 *
 * @returns An array of metadata objects setting the page title to "Calendar" and the description content to "Calendar".
 */
export function meta() {
  return [{ title: "Calendar" }, { name: "description", content: "Calendar" }]
}

/**
 * Render the authenticated home page layout with a sidebar, calendar, and event modal.
 *
 * @returns The JSX element representing the home page layout composed of an auth wrapper, a sidebar provider (including the app sidebar and calendar inset), and an event modal.
 */
export default function Home() {
  return (
    <AuthWrapper>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <EventCalendar />
        </SidebarInset>
      </SidebarProvider>
      <EventModal />
    </AuthWrapper>
  )
}