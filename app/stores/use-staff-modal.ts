import { create } from "zustand"
import type { StaffMember } from "@/components/staff/staff-table-columns"

type ModalType = "create" | "update" | "delete" | null

interface StaffModalStore {
  type: ModalType
  isOpen: boolean
  staff: StaffMember | null
  onOpen: (type: ModalType, staff?: StaffMember) => void
  onClose: () => void
}

export const useStaffModal = create<StaffModalStore>((set) => ({
  type: null,
  isOpen: false,
  staff: null,
  onOpen: (type, staff) =>
    set({
      type,
      isOpen: true,
      staff: staff || null
    }),
  onClose: () => {
    set({ type: null, isOpen: false })
    setTimeout(() => set({ staff: null }), 500)
  }
}))
