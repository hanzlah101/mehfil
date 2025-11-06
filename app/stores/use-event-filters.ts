import type { Doc } from "@db/_generated/dataModel"
import { create } from "zustand"

export type EventFilterType = Doc<"events">["type"] | "all"
export type EventFoodServiceType = "all" | "with" | "without"

export type EventFilters = {
  search: string
  venueIds: string[]
  eventType: EventFilterType
  foodService: EventFoodServiceType
}

type EventFiltersStore = EventFilters & {
  setSearch: (search: string) => void
  setVenueIds: (venueIds: string[]) => void
  setEventType: (eventType: EventFilterType) => void
  setFoodService: (foodService: EventFoodServiceType) => void
  clear: () => void
}

const initialState: EventFilters = {
  search: "",
  venueIds: [],
  eventType: "all",
  foodService: "all"
}

export const useEventFiltersStore = create<EventFiltersStore>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setVenueIds: (venueIds) => set({ venueIds }),
  setEventType: (eventType) => set({ eventType }),
  setFoodService: (foodService) => set({ foodService }),
  clear: () => set({ venueIds: [], eventType: "all", foodService: "all" })
}))
