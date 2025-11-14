import { RiSearchLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import type { Doc } from "@db/auth/_generated/dataModel"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group"

export function StaffTableFilters({ table }: { table: Table<Doc<"user">> }) {
  const globalFilter = table.getState().globalFilter

  return (
    <InputGroup className="w-full max-w-sm flex-1">
      <InputGroupInput
        placeholder="Search staff..."
        value={globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="pl-9"
      />
      <InputGroupAddon>
        <RiSearchLine />
      </InputGroupAddon>
    </InputGroup>
  )
}
