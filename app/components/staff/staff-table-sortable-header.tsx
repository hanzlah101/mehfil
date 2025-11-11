import { Button } from "@/components/ui/button"
import type { Column } from "@tanstack/react-table"
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiArrowUpDownLine
} from "@remixicon/react"

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>
  children: React.ReactNode
}

export function SortableHeader<TData>({
  column,
  children
}: SortableHeaderProps<TData>) {
  const isSorted = column.getIsSorted()

  return (
    <Button
      size="fit"
      variant="muted"
      onClick={column.getToggleSortingHandler()}
      className="data-[state=open]:text-foreground"
    >
      {children}
      {isSorted === "asc" ? (
        <RiArrowUpLine className="size-3.5 text-muted-foreground" />
      ) : isSorted === "desc" ? (
        <RiArrowDownLine className="size-3.5 text-muted-foreground" />
      ) : (
        <RiArrowUpDownLine className="size-3.5 text-muted-foreground" />
      )}
    </Button>
  )
}
