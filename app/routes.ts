import {
  index,
  route,
  layout,
  type RouteConfig
} from "@react-router/dev/routes"

export default [
  layout("layouts/app-layout.tsx", [
    index("routes/events.tsx"),
    route("venues", "routes/venues.tsx"),
    route("staff", "routes/staff.tsx")
  ])
] satisfies RouteConfig
