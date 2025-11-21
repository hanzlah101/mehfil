import { create } from "zustand"
import type { Doc } from "@db/_generated/dataModel"
import type { ConditionalArgs } from "@/lib/types"

type ModalType = "create" | "update" | "delete"

type AddonModalStore = {
  isOpen: boolean
  type?: ModalType
  addon?: Doc<"addons">
  onOpen: (...args: ConditionalArgs<ModalType, Doc<"addons">, "create">) => void
  onClose: () => void
}

export const useAddonModal = create<AddonModalStore>((set) => ({
  isOpen: false,
  type: undefined,
  addon: undefined,
  onOpen: (type, addon?) => {
    if (type === "create") {
      set({ isOpen: true, type, addon: undefined })
    } else {
      if (!addon) throw new Error(`Addon is required for type "${type}"`)
      set({ isOpen: true, type, addon })
    }
  },
  onClose: () => {
    set({ type: undefined, isOpen: false })
    setTimeout(() => {
      set((state) => (state.isOpen ? state : { ...state, addon: undefined }))
    }, 500)
  }
}))
