import { toast } from "sonner"
import { api } from "@db/_generated/api"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { useVenueModal } from "@/stores/use-venue-modal"
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

export function DeleteVenueDialog() {
  const { venue, isOpen, type, onClose } = useVenueModal()
  const { mutate: deleteVenue, isPending } = useMutation({
    mutationFn: useConvexMutation(api.venues.del),
    onSuccess: () => {
      onClose()
      toast.success("Venue Updated Successfully!")
    }
  })

  return (
    <AlertDialog open={isOpen && type === "delete"} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            venue{" "}
            <span className="font-medium text-foreground">{venue?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            loading={isPending}
            onClick={() => (venue ? deleteVenue({ id: venue?._id }) : {})}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
