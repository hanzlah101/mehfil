import { Label } from "@/components/ui/label"
import {
  useEventFiltersStore,
  type EventFilterStatus
} from "@/stores/use-event-filters"
import { FilterRadioGroup, FilterRadioItem } from "./filter-radio-group"
import { EVENT_STATUSES, EVENT_STATUS_LABELS } from "@/lib/constants"

export function EventsTypeFilter() {
  const pendingEventStatus = useEventFiltersStore((s) => s.pendingEventStatus)
  const setPendingEventStatus = useEventFiltersStore(
    (s) => s.setPendingEventStatus
  )

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-semibold">Event Status</Label>
        <p className="text-xs text-muted-foreground">
          Filter events by their status
        </p>
      </div>
      <FilterRadioGroup
        value={pendingEventStatus}
        onValueChange={(value) =>
          setPendingEventStatus(value as EventFilterStatus)
        }
      >
        <FilterRadioItem value="all" label="All" />
        {EVENT_STATUSES.map((status) => (
          <FilterRadioItem
            key={status}
            value={status}
            label={EVENT_STATUS_LABELS[status]}
          />
        ))}
      </FilterRadioGroup>
    </div>
  )
}
