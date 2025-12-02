import { create } from "zustand"
import type { Doc } from "@db/_generated/dataModel"

type ModalType = "create" | "update" | "delete" | "print-bill" | "cancel-event"
export type EventWithVenue = Doc<"events"> & {
  mealName: string | null
  venue: Doc<"venues">
}

type EventArgs =
  | [type: "create", date: Date]
  | [type: Exclude<ModalType, "create">, event: EventWithVenue]

type EventModalStore = {
  isOpen: boolean
  type?: ModalType
  date: Date | null
  event?: EventWithVenue
  onOpen: (...args: EventArgs) => void
  onClose: () => void
}

export const useEventModal = create<EventModalStore>((set) => ({
  isOpen: false,
  type: undefined,
  date: null,
  event: undefined,
  onOpen: (type, payload) => {
    if (type === "create") {
      set({ isOpen: true, type, date: payload as Date, event: undefined })
    } else {
      set({
        isOpen: true,
        type,
        event: payload,
        date: null
      })
    }
  },
  onClose: () => {
    set({ isOpen: false, type: undefined, event: undefined, date: null })
    setTimeout(() => set({ event: undefined, date: null }), 500)
  }
}))
