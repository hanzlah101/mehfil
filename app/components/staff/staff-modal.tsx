import { useStaffModal } from "@/stores/use-staff-modal"
import { StaffForm } from "@/components/staff/staff-form"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

const modalContent = {
  create: {
    title: "New Staff Member",
    description: "Add a new staff member with specific permissions"
  },
  update: {
    title: "Update Staff Member",
    description: "Modify staff member details and permissions"
  }
}

export function StaffModal() {
  const { type, isOpen, onClose } = useStaffModal()

  const content = type === "update" ? modalContent.update : modalContent.create

  return (
    <Drawer
      onClose={onClose}
      open={isOpen && (type === "create" || type === "update")}
    >
      <DrawerContent>
        <div className="overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{content.title}</DrawerTitle>
            <DrawerDescription>{content.description}</DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto w-full max-w-2xl px-4 pb-4">
            <StaffForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
