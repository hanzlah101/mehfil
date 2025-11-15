import { toast } from "sonner"
import { api } from "@db/_generated/api"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMealModal } from "@/stores/use-meal-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

export function DeleteMealDialog() {
  const { meal, isOpen, type, onClose } = useMealModal()
  const { mutate: deleteMeal, isPending } = useMutation({
    mutationFn: useConvexMutation(api.meals.del),
    onSuccess: () => {
      onClose()
      toast.success("Meal Deleted Successfully!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete meal"
      )
    }
  })

  return (
    <AlertDialog open={isOpen && type === "delete"} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your meal{" "}
            <span className="font-medium text-foreground">{meal?.title}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            loading={isPending}
            onClick={() => (meal ? deleteMeal({ id: meal?._id }) : {})}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
