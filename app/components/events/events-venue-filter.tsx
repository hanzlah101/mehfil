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
  const pendingVenueIds = useEventFiltersStore((s) => s.pendingVenueIds)
  const setPendingVenueIds = useEventFiltersStore((s) => s.setPendingVenueIds)

  const { data: venues = [] } = useQuery(convexQuery(api.venues.list, {}))

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-semibold">Venues</Label>
        <p className="text-xs text-muted-foreground">
          Filter events by venue location
        </p>
      </div>
      <MultiSelect values={pendingVenueIds} onValuesChange={setPendingVenueIds}>
        <MultiSelectTrigger className="w-full">
          <MultiSelectValue placeholder="Select venues..." />
        </MultiSelectTrigger>
        <MultiSelectContent
          search={{
            emptyMessage: "No venue found",
            placeholder: "Search venues..."
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
