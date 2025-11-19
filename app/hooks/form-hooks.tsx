import { useRef } from "react"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import type { FormOptions } from "@tanstack/react-form"
import type { FormApiArgs } from "@/lib/types"
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

const {
  useFieldContext,
  useFormContext: useUntypedFOrmContext,
  fieldContext,
  formContext
} = createFormHookContexts()

const {
  useAppForm: useTanstackAppForm,
  withForm,
  withFieldGroup
} = createFormHook({
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

function useAppForm<T>(
  params: FormOptions<
    FormApiArgs<T>[0],
    FormApiArgs<T>[1],
    FormApiArgs<T>[2],
    FormApiArgs<T>[3],
    FormApiArgs<T>[4],
    FormApiArgs<T>[5],
    FormApiArgs<T>[6],
    FormApiArgs<T>[7],
    FormApiArgs<T>[8],
    FormApiArgs<T>[9],
    FormApiArgs<T>[10],
    FormApiArgs<T>[11]
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
      let firstInput: Inputs | undefined = undefined
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

function useFormContext<T>() {
  return useUntypedFOrmContext() as unknown as ReturnType<
    typeof useTanstackAppForm<
      FormApiArgs<T>[0],
      FormApiArgs<T>[1],
      FormApiArgs<T>[2],
      FormApiArgs<T>[3],
      FormApiArgs<T>[4],
      FormApiArgs<T>[5],
      FormApiArgs<T>[6],
      FormApiArgs<T>[7],
      FormApiArgs<T>[8],
      FormApiArgs<T>[9],
      FormApiArgs<T>[10],
      FormApiArgs<T>[11]
    >
  >
}

export { useAppForm, withForm, withFieldGroup, useFieldContext, useFormContext }
