import { useAddonModal } from "@/stores/use-addon-modal"
import { AddonForm } from "@/components/addons/addon-form"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

const modalContent = {
  create: {
    title: "New Addon",
    description: "Create a new addon with pricing for events"
  },
  update: {
    title: "Update Addon",
    description: "Modify the addon details and pricing"
  }
}

export function AddonModal() {
  const { type, isOpen, onClose } = useAddonModal()

  const content =
    type && (type === "create" || type === "update")
      ? modalContent[type]
      : modalContent.create

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

          <div className="mx-auto w-full max-w-2xl px-4">
            <AddonForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
