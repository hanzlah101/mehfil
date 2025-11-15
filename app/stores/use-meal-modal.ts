import { create } from "zustand"
import type { Doc } from "@db/_generated/dataModel"
import type { ConditionalArgs } from "@/lib/types"

type ModalType = "create" | "update" | "delete"

type MealModalStore = {
  isOpen: boolean
  type?: ModalType
  meal?: Doc<"meals">
  onOpen: (...args: ConditionalArgs<ModalType, Doc<"meals">, "create">) => void
  onClose: () => void
}

export const useMealModal = create<MealModalStore>((set) => ({
  isOpen: false,
  type: undefined,
  meal: undefined,
  onOpen: (type, meal?) => {
    if (type === "create") {
      set({ isOpen: true, type, meal: undefined })
    } else {
      if (!meal) throw new Error(`Meal is required for type "${type}"`)
      set({ isOpen: true, type, meal })
    }
  },
  onClose: () => {
    set({ type: undefined, isOpen: false })
    setTimeout(() => set({ meal: undefined }), 500)
  }
}))
