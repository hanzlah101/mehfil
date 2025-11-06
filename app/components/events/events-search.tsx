import { useEventFiltersStore } from "@/stores/use-event-filters"
import { RiCloseLine, RiSearchLine } from "@remixicon/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group"

export function EventsSearch() {
  const search = useEventFiltersStore((s) => s.search)
  const setSearch = useEventFiltersStore((s) => s.setSearch)

  return (
    <InputGroup className="max-w-100">
      <InputGroupInput
        value={search}
        placeholder="Search events..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <InputGroupAddon align="inline-start">
        <RiSearchLine />
      </InputGroupAddon>
      {search && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setSearch("")}
            className="text-muted-foreground hover:text-foreground"
          >
            <RiCloseLine className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
