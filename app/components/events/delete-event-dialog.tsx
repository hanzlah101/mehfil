import { toast } from "sonner"
import { api } from "@db/_generated/api"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { useEventModal } from "@/stores/use-event-modal"
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

export function DeleteEventDialog() {
  const { event, isOpen, type, onClose } = useEventModal()
  const { mutate: deleteEvent, isPending } = useMutation({
    mutationFn: useConvexMutation(api.events.del),
    onSuccess: () => {
      onClose()
      toast.success("Event Deleted Successfully!")
    }
  })

  return (
    <AlertDialog open={isOpen && type === "delete"} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            event{" "}
            <span className="font-medium text-foreground">{event?.title}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            loading={isPending}
            onClick={() => (event ? deleteEvent({ id: event?._id }) : {})}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
