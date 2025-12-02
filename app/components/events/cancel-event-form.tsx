import { toast } from "sonner"
import { api } from "@db/_generated/api"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { useEventModal } from "@/stores/use-event-modal"
import { useAppForm } from "@/hooks/form-hooks"
import { z } from "zod"
import { revalidateLogic } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@tanstack/react-form"

const cancelEventSchema = z.object({
  cancellationReason: z.string().min(1, "Please provide a cancellation reason")
})

export function CancelEventForm() {
  const { event, onClose } = useEventModal()

  const { mutateAsync: updateEvent } = useMutation({
    mutationFn: useConvexMutation(api.events.update),
    onSuccess: () => {
      onClose()
      toast.success("Event cancelled successfully!")
    }
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: cancelEventSchema
    },
    defaultValues: {
      cancellationReason: event?.cancellationReason ?? ""
    },
    onSubmit: async ({ value }) => {
      if (!event) return
      await updateEvent({
        id: event._id,
        status: "cancelled",
        cancellationReason: value.cancellationReason
      })
    }
  })

  const isPending = useStore(form.store, (s) => s.isSubmitting)

  return (
    <form.Form className="pb-4">
      <form.Group>
        <form.AppField name="cancellationReason">
          {(field) => (
            <field.Field>
              <field.Label required>Cancellation Reason</field.Label>
              <field.Control>
                <Textarea
                  placeholder="Please provide a reason for cancelling this event..."
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={6}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <Button
          type="submit"
          className="w-full"
          loading={isPending}
          variant="destructive"
        >
          Cancel Event
        </Button>
      </form.Group>
    </form.Form>
  )
}
