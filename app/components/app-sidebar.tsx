import { Link, useLocation } from "react-router"
import {
  RiCalendar2Line,
  RiCalendar2Fill,
  RiMapPinLine,
  RiMapPinFill,
  type RemixiconComponentType
} from "@remixicon/react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <MenuItem
              href="/"
              label="Calendar"
              icon={RiCalendar2Line}
              activeIcon={RiCalendar2Fill}
            />
            <MenuItem
              href="/venues"
              label="Venues"
              icon={RiMapPinLine}
              activeIcon={RiMapPinFill}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function MenuItem(item: {
  href: string
  label: string
  icon: RemixiconComponentType
  activeIcon: RemixiconComponentType
}) {
  const { pathname } = useLocation()
  const isActive = pathname === item.href

  const Icon = isActive ? item.activeIcon : item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild size="lg" isActive={isActive}>
        <Link to={item.href}>
          <Icon className="opacity-60" />
          {item.label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
