import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppHeader() {
  return (
    <header className="flex w-full items-center justify-between border-b px-4 py-3">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  )
}
