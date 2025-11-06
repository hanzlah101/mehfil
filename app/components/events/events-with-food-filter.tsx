import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  useEventFiltersStore,
  type EventFoodServiceType
} from "@/stores/use-event-filters"

export function EventsWithFoodFilter() {
  const foodService = useEventFiltersStore((s) => s.foodService)
  const setFoodService = useEventFiltersStore((s) => s.setFoodService)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Food Service</Label>
      <RadioGroup
        value={foodService}
        className="flex flex-wrap gap-4"
        onValueChange={(value) => setFoodService(value as EventFoodServiceType)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="food-all" />
          <Label htmlFor="food-all" className="cursor-pointer font-normal">
            All
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="with" id="food-with" />
          <Label htmlFor="food-with" className="cursor-pointer font-normal">
            With Food
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="without" id="food-without" />
          <Label htmlFor="food-without" className="cursor-pointer font-normal">
            Without Food
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
