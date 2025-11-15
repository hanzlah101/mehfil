import { MealModal } from "@/components/meals/meal-modal"
import { MealsList } from "@/components/meals/meals-list"
import { DeleteMealDialog } from "@/components/meals/delete-meal-dialog"
import { Protected } from "@/components/protected"
import { BRAND_NAME } from "@/lib/constants"

export function meta() {
  return [
    { title: `${BRAND_NAME} - Meals` },
    { name: "description", content: "Create and manage meal plans and pricing" }
  ]
}

export default function Meals() {
  return (
    <Protected perm="read:meals">
      <MealsList />
      <Protected operator="or" perm={["create:meal", "update:meal"]}>
        <MealModal />
      </Protected>
      <Protected perm="delete:meal">
        <DeleteMealDialog />
      </Protected>
    </Protected>
  )
}
