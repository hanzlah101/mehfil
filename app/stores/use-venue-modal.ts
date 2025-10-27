import { create } from "zustand"

type VenueModalStore = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useVenueModal = create<VenueModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
