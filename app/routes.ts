import {
  index,
  route,
  layout,
  type RouteConfig
} from "@react-router/dev/routes"

export default [
  layout("layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    route("venues", "routes/venues.tsx")
  ])
] satisfies RouteConfig
