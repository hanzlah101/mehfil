import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  useEventFiltersStore,
  type EventFilterType
} from "@/stores/use-event-filters"

export function EventsTypeFilter() {
  const eventType = useEventFiltersStore((s) => s.eventType)
  const setEventType = useEventFiltersStore((s) => s.setEventType)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Event Type</Label>
      <RadioGroup
        value={eventType}
        onValueChange={(value) => setEventType(value as EventFilterType)}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="type-all" />
          <Label htmlFor="type-all" className="cursor-pointer font-normal">
            All
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="booking" id="type-booking" />
          <Label htmlFor="type-booking" className="cursor-pointer font-normal">
            Booking
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="reservation" id="type-reservation" />
          <Label
            htmlFor="type-reservation"
            className="cursor-pointer font-normal"
          >
            Reservation
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
