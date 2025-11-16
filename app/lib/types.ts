import type { Doc } from "@db/_generated/dataModel"
import type {
  FormApi,
  FormAsyncValidateOrFn,
  FormValidateOrFn
} from "@tanstack/react-form"

export type ConditionalArgs<
  TType extends string,
  TData,
  TNoData extends TType = never
> = [type: TNoData] | [type: Exclude<TType, TNoData>, data: TData]

export type EventType = Doc<"events">["type"]

export type FormApiArgs<T> = [
  T,
  FormValidateOrFn<T> | undefined,
  FormValidateOrFn<T> | undefined,
  FormAsyncValidateOrFn<T> | undefined,
  FormValidateOrFn<T> | undefined,
  FormAsyncValidateOrFn<T> | undefined,
  FormValidateOrFn<T> | undefined,
  FormAsyncValidateOrFn<T> | undefined,
  FormValidateOrFn<T> | undefined,
  FormAsyncValidateOrFn<T> | undefined,
  FormAsyncValidateOrFn<T> | undefined,
  unknown
]

export type AnyFormApi<T> = FormApi<
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
