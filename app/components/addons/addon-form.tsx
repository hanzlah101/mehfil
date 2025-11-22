import { revalidateLogic, useStore } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { addonSchema, type AddonSchema } from "@/validations/addons"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { useAddonModal } from "@/stores/use-addon-modal"
import { EMPTY_NUMBER } from "@/lib/constants"
import { useAppForm } from "@/hooks/form-hooks"
import { NumberInput } from "@/components/ui/number-input"

export function AddonForm() {
  const closeAddonModal = useAddonModal((s) => s.onClose)
  const initialValues = useAddonModal((s) => s.addon)

  const { mutateAsync: createAddon } = useMutation({
    mutationFn: useConvexMutation(api.addons.create),
    onSuccess: () => {
      closeAddonModal()
      toast.success("New Addon Created!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create addon"
      )
    }
  })

  const { mutateAsync: updateAddon } = useMutation({
    mutationFn: useConvexMutation(api.addons.update),
    onSuccess: () => {
      closeAddonModal()
      toast.success("Addon Updated Successfully!")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update addon"
      )
    }
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: addonSchema
    },
    defaultValues: {
      name: initialValues?.name ?? "",
      unit: initialValues?.unit ?? "",
      qty: initialValues?.qty ?? EMPTY_NUMBER,
      unitPrice: initialValues?.unitPrice ?? EMPTY_NUMBER
    } satisfies AddonSchema as AddonSchema,
    onSubmit: async ({ formApi, value }) => {
      if (initialValues) {
        await updateAddon({ id: initialValues._id, ...value })
      } else {
        await createAddon(value)
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
              <field.Label required>Addon Name</field.Label>
              <field.Control>
                <Input
                  autoFocus
                  placeholder="e.g., AC Charges"
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

        <form.AppField name="unit">
          {(field) => (
            <field.Field>
              <field.Label required>Unit</field.Label>
              <field.Control>
                <Input
                  placeholder="e.g., Per Hour"
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

        <form.AppField name="qty">
          {(field) => (
            <field.Field>
              <field.Label required>Quantity</field.Label>
              <field.Control>
                <NumberInput
                  min={1}
                  inputMode="numeric"
                  placeholder="1"
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

        <form.AppField name="unitPrice">
          {(field) => (
            <field.Field>
              <field.Label required>Unit Price</field.Label>
              <field.Control>
                <NumberInput
                  min={0}
                  inputMode="numeric"
                  placeholder="1000"
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

        <div className="sticky bottom-0 z-10 w-full bg-background py-4">
          <Button type="submit" className="w-full" loading={isPending}>
            {initialValues ? "Save Changes" : "Create Addon"}
          </Button>
        </div>
      </form.Group>
    </form.Form>
  )
}
