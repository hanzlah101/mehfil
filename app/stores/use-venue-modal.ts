import { create } from "zustand"
import type { Doc } from "@db/_generated/dataModel"
import type { ConditionalArgs } from "@/lib/types"

type ModalType = "create" | "update" | "delete"

type VenueModalStore = {
  isOpen: boolean
  type?: ModalType
  venue?: Doc<"venues">
  onOpen: (...args: ConditionalArgs<ModalType, Doc<"venues">, "create">) => void
  onClose: () => void
}

export const useVenueModal = create<VenueModalStore>((set) => ({
  isOpen: false,
  type: undefined,
  venue: undefined,
  onOpen: (type, venue?) => {
    if (type === "create") {
      set({ isOpen: true, type, venue: undefined })
    } else {
      if (!venue) throw new Error(`Venue is required for type "${type}"`)
      set({ isOpen: true, type, venue })
    }
  },
  onClose: () => set({ isOpen: false, type: undefined, venue: undefined })
}))
