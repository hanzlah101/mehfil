import { toast } from "sonner"
import { useStaffModal } from "@/stores/use-staff-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppForm } from "@/hooks/form-hooks"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { revalidateLogic, useStore } from "@tanstack/react-form"
import { PasswordInput } from "@/components/ui/password-input"
import {
  staffCreateSchema,
  staffUpdateSchema,
  type StaffCreateInput
} from "@/validations/staff"
import {
  extractManageablePermissions,
  formatPermission,
  MANAGEABLE_PERMISSIONS
} from "@/lib/permissions"
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem
} from "@/components/ui/multi-select"

export function StaffForm() {
  const initialValues = useStaffModal((s) => s.staff)
  const closeStaffModal = useStaffModal((s) => s.onClose)

  const { mutateAsync: createStaff } = useMutation({
    mutationFn: useConvexMutation(api.staff.create),
    onSuccess: () => {
      closeStaffModal()
      toast.success("Staff Member Created!")
    }
  })

  const { mutateAsync: updateStaff } = useMutation({
    mutationFn: useConvexMutation(api.staff.update),
    onSuccess: () => {
      closeStaffModal()
      toast.success("Staff Member Updated!")
    }
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: initialValues ? staffUpdateSchema : staffCreateSchema
    },
    defaultValues: {
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      password: "",
      permissions: extractManageablePermissions(
        initialValues?.permissions ?? []
      )
    } satisfies StaffCreateInput as StaffCreateInput,
    onSubmit: async ({ formApi, value }) => {
      if (initialValues) {
        const { password: _password, ...updateData } = value
        await updateStaff({
          ...updateData,
          id: initialValues._id
        })
      } else {
        await createStaff({
          ...value,
          password: value.password
        })
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
                  placeholder="John Doe"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="email">
          {(field) => (
            <field.Field>
              <field.Label required>Email</field.Label>
              <field.Control>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="email"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        {!initialValues && (
          <form.AppField name="password">
            {(field) => (
              <field.Field>
                <field.Label required>Password</field.Label>
                <field.Control>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isPending}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.Control>
                <field.Description>
                  Must be at least 8 characters
                </field.Description>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>
        )}

        <form.AppField name="permissions">
          {(field) => (
            <field.Field>
              <field.Label>Permissions</field.Label>
              <field.Control>
                <MultiSelect
                  values={field.state.value}
                  onValuesChange={(values) =>
                    field.handleChange(values as typeof field.state.value)
                  }
                >
                  <MultiSelectTrigger disabled={isPending}>
                    <MultiSelectValue placeholder="Select permissions" />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {MANAGEABLE_PERMISSIONS.map((perm) => (
                        <MultiSelectItem key={perm} value={perm}>
                          {formatPermission(perm)}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </field.Control>
              <field.Description>
                Staff members have read-only access by default
              </field.Description>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <div className="sticky bottom-0 z-10 w-full bg-background py-4">
          <Button type="submit" className="w-full" loading={isPending}>
            {initialValues ? "Save Changes" : "Create Staff Member"}
          </Button>
        </div>
      </form.Group>
    </form.Form>
  )
}
