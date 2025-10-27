import { Outlet } from "react-router"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthWrapper } from "@/components/auth-wrapper"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout() {
  return (
    <AuthWrapper>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="space-y-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthWrapper>
  )
}
