import { toast } from "sonner"
import { api } from "@db/_generated/api"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { useAddonModal } from "@/stores/use-addon-modal"
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

export function DeleteAddonDialog() {
  const { addon, isOpen, type, onClose } = useAddonModal()
  const { mutate: deleteAddon, isPending } = useMutation({
    mutationFn: useConvexMutation(api.addons.del),
    onSuccess: () => {
      onClose()
      toast.success("Addon Deleted Successfully!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete addon"
      )
    }
  })

  return (
    <AlertDialog open={isOpen && type === "delete"} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            addon{" "}
            <span className="font-medium text-foreground">{addon?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            loading={isPending}
            onClick={() => (addon ? deleteAddon({ id: addon?._id }) : {})}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
