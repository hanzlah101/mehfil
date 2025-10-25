import { z } from "zod"
import { isAfter } from "date-fns"
import { dateSchema, emailSchema } from "@/validations/_utils"

export const eventSchema = z
  .object({
    title: z.string().min(1, "Please enter event title"),
    notes: z.string().optional(),
    bookingDate: dateSchema("Please enter booking date"),
    startTime: dateSchema("Please enter start time"),
    endTime: dateSchema("Please enter end time"),
    type: z.enum(["reservation", "booking"], "Please select event type"),
    customerName: z.string().min(1, "Please enter customer name"),
    guestArrival: z.string().optional(),
    customerEmail: z.union([z.literal(""), emailSchema.optional()]),
    customerPhone: z.string().optional(),
    pax: z.optional(
      z.union([
        z.int().positive("Pax must be greater than 1"),
        z
          .object({
            from: z.int().positive("Pax must be greater than 1"),
            to: z.int().positive("Pax must be greater than 1")
          })
          .refine((val) => val.to > val.from, {
            error: "Max guests must be greater than start",
            path: ["to"]
          })
      ])
    ),
    withFood: z.boolean(),
    venueId: z.string().min(1, "Please select a venue")
  })
  .refine((val) => isAfter(val.endTime, val.startTime), {
    message: "End time must be later than the start time",
    path: ["endTime"]
  })

export type EventSchema = z.infer<typeof eventSchema>
