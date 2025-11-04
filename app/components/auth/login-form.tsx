import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { authClient } from "@/lib/auth-client"
import { useNavigate } from "react-router"
import { loginSchema } from "@/validations/auth"
import { useAppForm } from "@/hooks/form-hooks"
import { revalidateLogic, useStore } from "@tanstack/react-form"

export function LoginForm() {
  const navigate = useNavigate()

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: loginSchema
    },
    defaultValues: {
      email: "",
      password: ""
    },
    onSubmit: async ({ value, formApi }) => {
      const { error } = await authClient.signIn.email(value)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Successfully logged in!")
      navigate("/", { replace: true })
      formApi.reset()
    }
  })

  const isPending = useStore(form.store, (s) => s.isSubmitting)

  return (
    <form.Form>
      <form.FieldSet>
        <form.Legend>Welcome Back!</form.Legend>
        <form.Description>
          Please login with your account to access your calendar
        </form.Description>

        <form.Group>
          <form.AppField name="email">
            {(field) => (
              <field.Field>
                <field.Label required htmlFor={field.name}>
                  Email
                </field.Label>

                <field.Control>
                  <Input
                    autoFocus
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
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

          <form.AppField name="password">
            {(field) => (
              <field.Field>
                <field.Label required>Password</field.Label>
                <field.Control>
                  <PasswordInput
                    id={field.name}
                    autoComplete="current-password"
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
        </form.Group>

        <Button type="submit" className="w-full" loading={isPending} size="lg">
          Login
        </Button>
      </form.FieldSet>
    </form.Form>
  )
}
