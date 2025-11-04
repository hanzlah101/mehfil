import type { Doc } from "@db/_generated/dataModel"

export type ConditionalArgs<
  TType extends string,
  TData,
  TNoData extends TType = never
> = [type: TNoData] | [type: Exclude<TType, TNoData>, data: TData]

export type EventType = Doc<"events">["type"]
