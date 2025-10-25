import { z } from "zod/mini"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useNavigate } from "react-router"
import { revalidateLogic, useForm, useStore } from "@tanstack/react-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from "@/components/ui/field"

const loginSchema = z.object({
  email: z
    .string()
    .check(
      z.minLength(1, "Email is required"),
      z.email("Invalid email address")
    ),
  password: z.string().check(z.minLength(1, "Password is required"))
})

const FORM_ID = "login-form"

export function LoginForm() {
  const navigate = useNavigate()

  const form = useForm({
    validationLogic: revalidateLogic(),
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onDynamic: loginSchema
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email(value)
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Successfully logged in!")
      navigate("/", { replace: true })
    },
    onSubmitInvalid: ({ formApi }) => {
      const errorMap = formApi.state.errorMap.onDynamic!
      const inputs = Array.from(
        document.querySelectorAll(`#${FORM_ID} input`)
      ) as HTMLInputElement[]

      let firstInput: HTMLInputElement | undefined
      for (const input of inputs) {
        if (errorMap[input.name]) {
          firstInput = input
          break
        }
      }
      setTimeout(() => firstInput?.focus(), 0)
    }
  })

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    evt.stopPropagation()
    form.handleSubmit()
  }

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)

  return (
    <form id={FORM_ID} onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend className="text-center">Welcome Back!</FieldLegend>
        <FieldDescription className="text-center">
          Please login with your account to access your calendar
        </FieldDescription>

        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    disabled={isSubmitting}
                    placeholder="Enter your email address"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    disabled={isSubmitting}
                    placeholder="Enter your password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Login
        </Button>
      </FieldSet>
    </form>
  )
}
