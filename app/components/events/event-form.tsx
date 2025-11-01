import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { useEventModal } from "@/stores/use-event-modal"
import { eventSchema } from "@/validations/events"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@/components/date-picker"
import { Switch } from "@/components/ui/switch"
import { TimeField } from "@/components/ui/time-field"
import { useForm } from "react-hook-form"
import { setDatePreserveTime, defaultEventTime } from "@/lib/date"
import { RiRestaurantFill } from "@remixicon/react"
import {
  Form,
  FormControl,
  FormDescription,
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

export function EventForm() {
  const initialDate = useEventModal((s) => s.date)
  const initialValues = useEventModal((s) => s.event)

  const { defaultStartTime, defaultEndTime } = useMemo(
    () => defaultEventTime(initialDate ?? new Date()),
    [initialDate]
  )

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      type: initialValues?.type ?? "booking",
      customerName: initialValues?.customerName ?? "",
      customerEmail: initialValues?.customerEmail,
      customerPhone: initialValues?.customerPhone,
      withFood: initialValues?.withFood ?? false,
      venueId: initialValues?.venueId ?? "",
      guestArrival: initialValues?.guestArrival,
      notes: initialValues?.notes,
      pax: initialValues?.pax,
      bookingDate: initialValues
        ? new Date(initialValues.bookingDate)
        : new Date(),
      startTime: initialValues
        ? new Date(initialValues.startTime)
        : defaultStartTime,
      endTime: initialValues ? new Date(initialValues.endTime) : defaultEndTime
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
                    type="email"
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
                    type="tel"
                    autoComplete="tel"
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

        <FormField
          control={form.control}
          name="withFood"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-4 shadow-xs dark:bg-input/30",
                  field.value &&
                    "border-primary bg-primary/10 dark:bg-primary/10"
                )}
              >
                <RiRestaurantFill
                  className={cn(
                    "size-6",
                    field.value ? "text-primary" : "opacity-60"
                  )}
                />
                <div className="flex flex-col gap-1">
                  <p className="leading-none">With Food</p>
                  <FormDescription className="text-xs leading-none">
                    Specify whether food or catering services will be provided
                    for this event.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    className="ml-auto"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {initialValues ? "Save Changes" : "Create Event"}
        </Button>
      </form>
    </Form>
  )
}
