import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useEventModal } from "@/stores/use-event-modal"
import { eventSchema, type EventSchema } from "@/validations/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Switch } from "@/components/ui/switch"
import { TimeField } from "@/components/ui/time-field"
import { RiRestaurantFill } from "@remixicon/react"
import { setDatePreserveTime, defaultEventTime } from "@/lib/date"
import { useAppForm, useFieldContext } from "@/hooks/form-hooks"
import { useQuery, useMutation } from "@tanstack/react-query"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { api } from "@db/_generated/api"
import { revalidateLogic, useStore } from "@tanstack/react-form"
import { FieldControl } from "@/components/ui/field"
import type { EventType } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import type { Id } from "@db/_generated/dataModel"

export function EventForm() {
  const initialDate = useEventModal((s) => s.date)
  const initialValues = useEventModal((s) => s.event)
  const closeEventModal = useEventModal((s) => s.onClose)

  const { defaultStartTime, defaultEndTime } = useMemo(
    () => defaultEventTime(initialDate ?? new Date()),
    [initialDate]
  )

  const { mutateAsync: createEvent } = useMutation({
    mutationFn: useConvexMutation(api.events.create),
    onSuccess: () => {
      closeEventModal()
      toast.success("New Event Created!")
    }
  })

  const { mutateAsync: updateEvent } = useMutation({
    mutationFn: useConvexMutation(api.events.update),
    onSuccess: () => {
      closeEventModal()
      toast.success("Event Updated Successfully!")
    }
  })

  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: eventSchema
    },
    defaultValues: {
      title: initialValues?.title ?? "",
      type: initialValues?.type ?? "booking",
      customerName: initialValues?.customerName ?? "",
      customerEmail: initialValues?.customerEmail ?? "",
      customerPhone: initialValues?.customerPhone ?? "",
      withFood: initialValues?.withFood ?? false,
      venueId: initialValues?.venueId ?? "",
      guestArrival: initialValues?.guestArrival ?? "",
      notes: initialValues?.notes ?? "",
      pax: initialValues?.pax,
      bookingDate: initialValues
        ? new Date(initialValues.bookingDate)
        : new Date(),
      startTime: initialValues
        ? new Date(initialValues.startTime)
        : defaultStartTime,
      endTime: initialValues ? new Date(initialValues.endTime) : defaultEndTime
    } satisfies EventSchema as EventSchema,
    onSubmit: async ({ formApi, value }) => {
      const body = {
        ...value,
        venueId: value.venueId as Id<"venues">,
        bookingDate: value.bookingDate.getTime(),
        startTime: value.startTime.getTime(),
        endTime: value.endTime.getTime()
      }

      if (initialValues) {
        await updateEvent({ ...body, id: initialValues._id })
      } else {
        await createEvent(body)
      }
      formApi.reset()
    }
  })

  const isPending = useStore(form.store, (s) => s.isSubmitting)

  return (
    <form.Form>
      <form.Group>
        <form.AppField name="title">
          {(field) => (
            <field.Field>
              <field.Label required>Title</field.Label>
              <field.Control>
                <Input
                  autoFocus
                  placeholder="Corporate Dinner"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="type">
          {(field) => (
            <field.Field>
              <field.Label required>Event Type</field.Label>
              <Select
                disabled={isPending}
                value={field.state.value}
                onValueChange={(type) => field.handleChange(type as EventType)}
              >
                <field.Control>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </field.Control>

                <SelectContent>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="reservation">Reservation</SelectItem>
                </SelectContent>
              </Select>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <div className="grid items-start gap-6 md:grid-cols-2">
          <form.AppField name="bookingDate">
            {(field) => (
              <field.Field>
                <field.Label required>Booking Date</field.Label>
                <field.Control>
                  <DatePicker
                    value={field.state.value}
                    disabled={isPending}
                    onChange={(val) => field.handleChange(val!)}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="startTime">
            {(field) => (
              <field.Field>
                <field.Label required>Event Date</field.Label>
                <field.Control>
                  <DatePicker
                    value={field.state.value}
                    onChange={(newValue) => {
                      if (!newValue) return
                      const newStart = setDatePreserveTime(
                        field.state.value,
                        newValue
                      )
                      const newEnd = setDatePreserveTime(
                        form.getFieldValue("endTime"),
                        newValue
                      )
                      field.handleChange(newStart)
                      form.setFieldValue("endTime", newEnd)
                    }}
                    disabled={isPending}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-2">
          <form.AppField name="startTime">
            {(field) => (
              <field.Field>
                <field.Label required>Start Time</field.Label>
                <field.Control>
                  <TimeField
                    disabled={isPending}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <form.AppField
            name="endTime"
            validators={{ onChangeListenTo: ["startTime"] }}
          >
            {(field) => (
              <field.Field>
                <field.Label required>End Time</field.Label>
                <field.Control>
                  <TimeField
                    disabled={isPending}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-2">
          <form.AppField name="customerName">
            {(field) => (
              <field.Field>
                <field.Label required>Customer Name</field.Label>
                <field.Control>
                  <Input
                    placeholder="Ali Hamza"
                    disabled={isPending}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="guestArrival">
            {(field) => (
              <field.Field>
                <field.Label>Guests Arrival</field.Label>
                <field.Control>
                  <Input
                    placeholder="Gujranwala"
                    disabled={isPending}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-2">
          <form.AppField name="customerEmail">
            {(field) => (
              <field.Field>
                <field.Label>Customer Email</field.Label>
                <field.Control>
                  <Input
                    type="email"
                    placeholder="ali@hamza.com"
                    autoComplete="email"
                    disabled={isPending}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="customerPhone">
            {(field) => (
              <field.Field>
                <field.Label>Customer Phone</field.Label>
                <field.Control>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="0306-6666666"
                    disabled={isPending}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.Control>
                <field.Error />
              </field.Field>
            )}
          </form.AppField>
        </div>

        <form.AppField name="venueId">
          {(field) => (
            <field.Field>
              <field.Label required>Venue</field.Label>
              <VenueSelect />
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="notes">
          {(field) => (
            <field.Field>
              <field.Label>Notes</field.Label>
              <field.Control>
                <Textarea
                  placeholder="Write some useful notes"
                  disabled={isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </field.Control>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="withFood">
          {(field) => (
            <field.Field>
              <field.Label
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-md border border-input px-4 py-4.5 shadow-xs dark:bg-input/30",
                  field.state.value &&
                    "border-primary bg-primary/10 dark:bg-primary/10"
                )}
              >
                <RiRestaurantFill
                  className={cn(
                    "size-8",
                    field.state.value ? "text-primary" : "opacity-60"
                  )}
                />
                <div className="flex flex-col gap-2">
                  <p className="leading-none">With Food</p>
                  <field.Description className="text-xs leading-none">
                    Specify whether food or catering services will be provided
                    for this event.
                  </field.Description>
                </div>
                <field.Control>
                  <Switch
                    className="ml-auto"
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </field.Control>
              </field.Label>
              <field.Error />
            </field.Field>
          )}
        </form.AppField>

        <div className="sticky bottom-0 z-10 w-full bg-background py-4">
          <Button type="submit" className="w-full" loading={isPending}>
            {initialValues ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </form.Group>
    </form.Form>
  )
}

function VenueSelect() {
  const field = useFieldContext<string>()
  const { data } = useQuery(convexQuery(api.venues.list, {}))

  const isPending = useStore(field.form.store, (s) => s.isSubmitting)

  return (
    <Select
      disabled={isPending}
      value={field.state.value}
      onValueChange={field.handleChange}
    >
      <FieldControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pick a venue" />
        </SelectTrigger>
      </FieldControl>

      <SelectContent>
        {data?.map((venue) => (
          <SelectItem key={venue._id} value={venue._id}>
            {venue.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
