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
  // Pending filters (not yet applied)
  pendingVenueIds: string[]
  pendingEventType: EventFilterType
  pendingFoodService: EventFoodServiceType

  // Actions
  setSearch: (search: string) => void
  setPendingVenueIds: (venueIds: string[]) => void
  setPendingEventType: (eventType: EventFilterType) => void
  setPendingFoodService: (foodService: EventFoodServiceType) => void
  applyFilters: () => void
  initializePending: () => void
  clear: () => void
}

const initialState: EventFilters = {
  search: "",
  venueIds: [],
  eventType: "all",
  foodService: "all"
}

export const useEventFiltersStore = create<EventFiltersStore>((set, get) => ({
  ...initialState,
  pendingVenueIds: [],
  pendingEventType: "all",
  pendingFoodService: "all",

  setSearch: (search) => set({ search }),
  setPendingVenueIds: (pendingVenueIds) => set({ pendingVenueIds }),
  setPendingEventType: (pendingEventType) => set({ pendingEventType }),
  setPendingFoodService: (pendingFoodService) => set({ pendingFoodService }),

  applyFilters: () => {
    const { pendingVenueIds, pendingEventType, pendingFoodService } = get()
    set({
      venueIds: pendingVenueIds,
      eventType: pendingEventType,
      foodService: pendingFoodService
    })
  },

  initializePending: () => {
    const { venueIds, eventType, foodService } = get()
    set({
      pendingVenueIds: venueIds,
      pendingEventType: eventType,
      pendingFoodService: foodService
    })
  },

  clear: () =>
    set({
      search: "",
      venueIds: [],
      eventType: "all",
      foodService: "all",
      pendingVenueIds: [],
      pendingEventType: "all",
      pendingFoodService: "all"
    })
}))
