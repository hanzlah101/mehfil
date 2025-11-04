import { useRef } from "react"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import {
  Form as CoreForm,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldContent,
  FieldGroup
} from "@/components/ui/field"
import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn
} from "@tanstack/react-form"

const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts()

const { useAppForm: useTanstackAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Field: Field,
    Label: FieldLabel,
    Control: FieldControl,
    Description: FieldDescription,
    Error: FieldError,
    Set: FieldSet,
    Legend: FieldLegend,
    Content: FieldContent
  },
  formComponents: {
    Group: FieldGroup,
    FieldSet: FieldSet,
    Legend: FieldLegend,
    Description: FieldDescription
  }
})

type Inputs = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

function useAppForm<
  TFormData,
  TOnMount extends FormValidateOrFn<TFormData> | undefined,
  TOnChange extends FormValidateOrFn<TFormData> | undefined,
  TOnChangeAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnBlur extends FormValidateOrFn<TFormData> | undefined,
  TOnBlurAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnSubmit extends FormValidateOrFn<TFormData> | undefined,
  TOnSubmitAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnDynamic extends FormValidateOrFn<TFormData> | undefined,
  TOnDynamicAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnServer extends FormAsyncValidateOrFn<TFormData> | undefined,
  TSubmitMeta = never
>(
  params: FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >
) {
  const formRef = useRef<HTMLFormElement>(null)
  const form = useTanstackAppForm({
    ...params,
    onSubmitInvalid({ formApi }) {
      if (!formRef.current) return
      const errMap: Record<string, unknown> = formApi.state.errorMap.onDynamic!
      const inputs = formRef.current.querySelectorAll<Inputs>(
        "input, textarea, select"
      )
      let firstInput: Inputs | undefined
      for (const input of inputs) {
        if (!!errMap?.[input.name]) {
          firstInput = input
          break
        }
      }
      setTimeout(() => firstInput?.focus(), 0)
    }
  })

  function Form(formProps: React.ComponentProps<typeof CoreForm>) {
    return (
      <form.AppForm>
        <CoreForm ref={formRef} {...formProps} />
      </form.AppForm>
    )
  }

  return { ...form, Form }
}

export { useAppForm, withForm, useFieldContext, useFormContext }
