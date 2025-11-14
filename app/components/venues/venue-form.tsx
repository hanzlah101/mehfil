import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { revalidateLogic, useStore } from "@tanstack/react-form"
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

  const { mutateAsync: createVenue } = useMutation({
    mutationFn: useConvexMutation(api.venues.create),
    onSuccess: () => {
      closeVenueModal()
      toast.success("New Venue Created!")
    }
  })

  const { mutateAsync: updateVenue } = useMutation({
    mutationFn: useConvexMutation(api.venues.update),
    onSuccess: () => {
      closeVenueModal()
      toast.success("Venue Updated Successfully!")
    }
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: venueSchema
    },
    defaultValues: {
      name: initialValues?.name ?? "",
      capacity: (initialValues?.capacity ?? null) as number,
      charges: (initialValues?.charges ?? null) as number,
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

  const isPending = useStore(form.store, (s) => s.isSubmitting)

  return (
    <form.Form>
      <form.Group>
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

        <form.AppField name="charges">
          {(field) => (
            <field.Field>
              <field.Label required>Charges</field.Label>
              <field.Control>
                <NumberInput
                  min={1}
                  inputMode="numeric"
                  placeholder="55000"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value as number)}
                />
              </field.Control>
              <field.Description>Hall charges for the event</field.Description>
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
                  disabled={isPending}
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
                        "aspect-square size-7 shrink-0 rounded-full outline-none disabled:opacity-50",
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
      </form.Group>
    </form.Form>
  )
}
