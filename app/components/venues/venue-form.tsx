import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { revalidateLogic } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { venueSchema, type VenueSchema } from "@/validations/venue"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useVenueModal } from "@/stores/use-venue-modal"
import { useAppForm } from "@/hooks/form-hooks"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import {
  getVenueColorStyles,
  VENUE_COLOR_CLASSES,
  VENUE_COLORS
} from "@/lib/colors"

export function VenueForm() {
  const closeVenueModal = useVenueModal((s) => s.onClose)
  const initialValues = useVenueModal((s) => s.venue)

  const { mutateAsync: createVenue, isPending: isCreating } = useMutation({
    mutationFn: useConvexMutation(api.venues.create),
    onSuccess: () => {
      closeVenueModal()
      toast.success("New Venue Created!")
    }
  })

  const { mutateAsync: updateVenue, isPending: isUpdating } = useMutation({
    mutationFn: useConvexMutation(api.venues.update),
    onSuccess: () => {
      closeVenueModal()
      toast.success("Venue Updated Successfully!")
    }
  })

  const isPending = isCreating || isUpdating

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: venueSchema
    },
    defaultValues: {
      name: initialValues?.name ?? "",
      capacity: initialValues?.capacity ?? NaN,
      location: initialValues?.location ?? "",
      color: initialValues?.color ?? VENUE_COLORS[0]
    } satisfies VenueSchema as VenueSchema,
    onSubmit: async ({ formApi, value }) => {
      if (initialValues) {
        await updateVenue({ id: initialValues._id, ...value })
      } else {
        await createVenue(value)
      }
      formApi.reset()
    }
  })

  return (
    <form.AppForm>
      <form.Form className="flex flex-col gap-6">
        <form.AppField name="name">
          {(field) => (
            <field.Field>
              <field.Label required>Name</field.Label>
              <field.Control>
                <Input
                  autoFocus
                  placeholder="Aroos ul Bahar"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="capacity">
          {(field) => (
            <field.Field>
              <field.Label required>Capacity</field.Label>
              <field.Control>
                <NumberInput
                  min={1}
                  inputMode="numeric"
                  placeholder="500"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value as number)}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="location">
          {(field) => (
            <field.Field>
              <field.Label>Location</field.Label>
              <field.Control>
                <Input
                  placeholder="Main GT. Road, Gujranwala"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="color">
          {(field) => (
            <field.Field>
              <field.Label>Color</field.Label>
              <field.Control>
                <RadioGroup
                  onValueChange={field.handleChange}
                  value={field.state.value}
                  className="flex flex-wrap gap-3"
                >
                  {VENUE_COLORS.map((color) => (
                    <RadioGroupItem
                      key={color}
                      value={color}
                      style={getVenueColorStyles(color)}
                      className={cn(
                        "aspect-square size-7 shrink-0 rounded-full outline-none",
                        VENUE_COLOR_CLASSES
                      )}
                    />
                  ))}
                </RadioGroup>
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <Button type="submit" className="w-full" loading={isPending}>
          {initialValues ? "Save Changes" : "Create Venue"}
        </Button>
      </form.Form>
    </form.AppForm>
  )
}
