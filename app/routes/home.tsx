import { AppSidebar } from "@/components/app-sidebar"
import { AuthWrapper } from "@/components/auth-wrapper"
import { EventCalendar } from "@/components/events/calendar"
import { EventModal } from "@/components/events/event-modal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function meta() {
  return [{ title: "Calendar" }, { name: "description", content: "Calendar" }]
}

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
