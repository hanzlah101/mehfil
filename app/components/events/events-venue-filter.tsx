import { Label } from "@/components/ui/label"
import { useEventFiltersStore } from "@/stores/use-event-filters"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectGroup
} from "@/components/ui/multi-select"

export function EventsVenueFilter() {
  const venueIds = useEventFiltersStore((s) => s.venueIds)
  const setVenueIds = useEventFiltersStore((s) => s.setVenueIds)

  const { data: venues = [] } = useQuery(convexQuery(api.venues.list, {}))

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Venues</Label>
      <MultiSelect values={venueIds} onValuesChange={setVenueIds}>
        <MultiSelectTrigger className="w-full">
          <MultiSelectValue placeholder="All venues" />
        </MultiSelectTrigger>
        <MultiSelectContent
          search={{
            emptyMessage: "No venue found",
            placeholder: "Search Venues..."
          }}
        >
          <MultiSelectGroup>
            {venues.map((venue) => (
              <MultiSelectItem key={venue._id} value={venue._id}>
                {venue.name}
              </MultiSelectItem>
            ))}
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
