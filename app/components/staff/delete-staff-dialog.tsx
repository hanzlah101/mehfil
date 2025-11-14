import { toast } from "sonner"
import { useStaffModal } from "@/stores/use-staff-modal"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
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

export function DeleteStaffDialog() {
  const { type, isOpen, staff, onClose } = useStaffModal()

  const { mutate: deleteStaff, isPending } = useMutation({
    mutationFn: useConvexMutation(api.staff.del),
    onSuccess: () => {
      onClose()
      toast.success("Staff Member Deleted")
    },
    onError: () => {
      toast.error("Failed to delete staff member")
    }
  })

  const handleDelete = () => {
    if (staff) {
      deleteStaff({ id: staff._id })
    }
  }

  return (
    <AlertDialog open={isOpen && type === "delete"} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{staff?.name}</span>
            ? This action cannot be undone and will permanently remove their
            access to the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} loading={isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
