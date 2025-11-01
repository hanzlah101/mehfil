import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  Form
} from "@/components/ui/form"

export const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  formComponents: {
    Form: Form
  },
  fieldComponents: {
    Field: Field,
    Label: FieldLabel,
    Control: FieldControl,
    Description: FieldDescription,
    Error: FieldError
  }
})
