import { Label } from "@/components/ui/label"
import {
  useEventFiltersStore,
  type EventFilterType
} from "@/stores/use-event-filters"
import { FilterRadioGroup, FilterRadioItem } from "./filter-radio-group"

export function EventsTypeFilter() {
  const pendingEventType = useEventFiltersStore((s) => s.pendingEventType)
  const setPendingEventType = useEventFiltersStore((s) => s.setPendingEventType)

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-semibold">Event Type</Label>
        <p className="text-xs text-muted-foreground">
          Choose between bookings and reservations
        </p>
      </div>
      <FilterRadioGroup
        value={pendingEventType}
        onValueChange={(value) => setPendingEventType(value as EventFilterType)}
      >
        <FilterRadioItem value="all" label="All" />
        <FilterRadioItem value="booking" label="Booking" />
        <FilterRadioItem value="reservation" label="Reservation" />
      </FilterRadioGroup>
    </div>
  )
}
