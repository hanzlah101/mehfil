import { Link, useLocation } from "react-router"
import { Protected } from "@/components/protected"
import { authClient } from "@/lib/auth-client"
import {
  RiCalendar2Line,
  RiCalendar2Fill,
  RiMapPinLine,
  RiMapPinFill,
  RiGroupLine,
  RiGroupFill,
  RiLogoutBoxLine,
  type RemixiconComponentType,
  RiRestaurantLine,
  RiRestaurantFill
} from "@remixicon/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
            <Protected perm="read:events">
              <MenuItem
                href="/"
                label="Calendar"
                icon={RiCalendar2Line}
                activeIcon={RiCalendar2Fill}
              />
            </Protected>

            <Protected perm="read:venues">
              <MenuItem
                href="/venues"
                label="Venues"
                icon={RiMapPinLine}
                activeIcon={RiMapPinFill}
              />
            </Protected>

            <Protected perm="read:staff">
              <MenuItem
                href="/staff"
                label="Staff"
                icon={RiGroupLine}
                activeIcon={RiGroupFill}
              />
            </Protected>

            <Protected perm="read:meals">
              <MenuItem
                href="/meals"
                label="Meals"
                icon={RiRestaurantLine}
                activeIcon={RiRestaurantFill}
              />
            </Protected>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={async () => authClient.signOut()}
            >
              <RiLogoutBoxLine />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
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
