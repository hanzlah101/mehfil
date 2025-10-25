import { useEventModal } from "@/stores/use-event-modal"
import { eventSchema } from "@/validations/events"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@/components/date-picker"
import { TimeField } from "@/components/ui/time-field"
import { useForm } from "react-hook-form"
import { setDatePreserveTime } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

/**
 * Renders a form for creating or scheduling an event.
 *
 * The form is validated with the project's event schema, exposes fields for title,
 * event type, booking date, start/end date and time, customer details, and notes.
 * Changing the event date preserves existing times and updates the end time accordingly.
 *
 * @returns The rendered event form element
 */
export function EventForm() {
  const initialDate = useEventModal((s) => s.date)
  const now = new Date()

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      bookingDate: now,
      startTime: initialDate ?? now,
      endTime: initialDate ?? now,
      type: "booking",
      customerName: "",
      withFood: false,
      venueId: "abcd"
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Title</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Corporate Dinner"
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Event Type</FormLabel>

              <Select
                disabled={isSubmitting}
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full" disabled={isSubmitting}>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="reservation">Reservation</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid items-start gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="bookingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Booking Date</FormLabel>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Event Date</FormLabel>
                <DatePicker
                  value={field.value}
                  disabled={isSubmitting}
                  onChange={(newValue) => {
                    if (!newValue) {
                      return
                    }

                    const newStartDate = setDatePreserveTime(
                      field.value,
                      newValue
                    )

                    const newEndDate = setDatePreserveTime(
                      form.getValues("endTime"),
                      newValue
                    )

                    field.onChange(newStartDate)
                    form.setValue("endTime", newEndDate)
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Start Time</FormLabel>
                <FormControl>
                  <TimeField disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>End Time</FormLabel>
                <FormControl>
                  <TimeField disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Customer Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ali Hamza"
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
            name="guestArrival"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests Arrival</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Gujranwala"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ali@hamza.com"
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
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0306-6666666"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write some useful notes"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create Event
        </Button>
      </form>
    </Form>
  )
}