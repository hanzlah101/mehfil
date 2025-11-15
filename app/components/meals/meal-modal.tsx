import { useMealModal } from "@/stores/use-meal-modal"
import { MealForm } from "@/components/meals/meal-form"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

const modalContent = {
  create: {
    title: "New Meal",
    description: "Create a new meal with items and pricing for events"
  },
  update: {
    title: "Update Meal",
    description: "Modify the meal items and pricing details"
  }
}

export function MealModal() {
  const { type, isOpen, onClose } = useMealModal()

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
            <MealForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
