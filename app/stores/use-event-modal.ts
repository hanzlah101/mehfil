import { create } from "zustand"
import type { Doc } from "@db/_generated/dataModel"

type ModalType = "create" | "update" | "delete"

/**
 * Custom conditional args for event modal:
 * - create → requires (date)
 * - update/delete → requires (event)
 */
type EventArgs =
  | [type: "create", date: Date]
  | [type: Exclude<ModalType, "create">, event: Doc<"events">]

type EventModalStore = {
  isOpen: boolean
  type?: ModalType
  date: Date | null
  event?: Doc<"events">
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
        event: payload as Doc<"events">,
        date: null
      })
    }
  },
  onClose: () =>
    set({ isOpen: false, type: undefined, event: undefined, date: null })
}))
