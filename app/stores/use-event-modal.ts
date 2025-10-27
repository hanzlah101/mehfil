import { create } from "zustand"

type EventModalStore = {
  onOpen: (date: Date) => void
  onClose: () => void
} & (
  | {
      isOpen: false
      date: null
    }
  | {
      isOpen: true
      date: Date
    }
)

export const useEventModal = create<EventModalStore>((set) => ({
  isOpen: false,
  date: null,
  onOpen: (date) => set({ isOpen: true, date }),
  onClose: () => set({ isOpen: false, date: null })
}))
