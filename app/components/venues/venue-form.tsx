import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { venueSchema } from "@/validations/venue"
import { getVenueColorClasses, VENUE_COLORS } from "@/lib/colors"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

export function VenueForm() {
  const form = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      color: VENUE_COLORS[0]
    }
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await new Promise((res) => setTimeout(res, 3000))
    console.log(values)
  })

  const isSubmitting = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Name</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Aroos ul Bahar"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Capacity</FormLabel>
              <FormControl>
                <NumberInput
                  min={1}
                  inputMode="numeric"
                  placeholder="500"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Main GT. Road, Gujranwala"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-3"
                >
                  {VENUE_COLORS.map((color) => (
                    <RadioGroupItem
                      key={color}
                      value={color}
                      className={cn(
                        "aspect-square size-8 shrink-0 rounded-full outline-none",
                        getVenueColorClasses(color)
                      )}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create Venue
        </Button>
      </form>
    </Form>
  )
}
