import { Label } from "@/components/ui/label"
import { FilterRadioGroup, FilterRadioItem } from "./filter-radio-group"
import {
  useEventFiltersStore,
  type EventFoodServiceType
} from "@/stores/use-event-filters"

export function EventsWithFoodFilter() {
  const pendingFoodService = useEventFiltersStore((s) => s.pendingFoodService)
  const setPendingFoodService = useEventFiltersStore(
    (s) => s.setPendingFoodService
  )

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base font-semibold">Food Service</Label>
        <p className="text-xs text-muted-foreground">
          Filter by food service availability
        </p>
      </div>
      <FilterRadioGroup
        value={pendingFoodService}
        onValueChange={(value) =>
          setPendingFoodService(value as EventFoodServiceType)
        }
      >
        <FilterRadioItem value="all" label="All" />
        <FilterRadioItem value="with" label="With Food" />
        <FilterRadioItem value="without" label="Without Food" />
      </FilterRadioGroup>
    </div>
  )
}
