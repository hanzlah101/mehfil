import type { Doc } from "@db/_generated/dataModel"
import { create } from "zustand"

export type EventFilterStatus = Doc<"events">["status"] | "all"
export type EventFoodServiceType = "all" | "with" | "without"

export type EventFilters = {
  search: string
  venueIds: string[]
  eventStatus: EventFilterStatus
  foodService: EventFoodServiceType
}

type EventFiltersStore = EventFilters & {
  // Pending filters (not yet applied)
  pendingVenueIds: string[]
  pendingEventStatus: EventFilterStatus
  pendingFoodService: EventFoodServiceType

  // Actions
  setSearch: (search: string) => void
  setPendingVenueIds: (venueIds: string[]) => void
  setPendingEventStatus: (eventStatus: EventFilterStatus) => void
  setPendingFoodService: (foodService: EventFoodServiceType) => void
  applyFilters: () => void
  initializePending: () => void
  clear: () => void
}

const initialState: EventFilters = {
  search: "",
  venueIds: [],
  eventStatus: "all",
  foodService: "all"
}

export const useEventFiltersStore = create<EventFiltersStore>((set, get) => ({
  ...initialState,
  pendingVenueIds: [],
  pendingEventStatus: "all",
  pendingFoodService: "all",

  setSearch: (search) => set({ search }),
  setPendingVenueIds: (pendingVenueIds) => set({ pendingVenueIds }),
  setPendingEventStatus: (pendingEventStatus) => set({ pendingEventStatus }),
  setPendingFoodService: (pendingFoodService) => set({ pendingFoodService }),

  applyFilters: () => {
    const { pendingVenueIds, pendingEventStatus, pendingFoodService } = get()
    set({
      venueIds: pendingVenueIds,
      eventStatus: pendingEventStatus,
      foodService: pendingFoodService
    })
  },

  initializePending: () => {
    const { venueIds, eventStatus, foodService } = get()
    set({
      pendingVenueIds: venueIds,
      pendingEventStatus: eventStatus,
      pendingFoodService: foodService
    })
  },

  clear: () =>
    set({
      search: "",
      venueIds: [],
      eventStatus: "all",
      foodService: "all",
      pendingVenueIds: [],
      pendingEventStatus: "all",
      pendingFoodService: "all"
    })
}))
