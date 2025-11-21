import { z } from "zod"
import { isAfter } from "date-fns"
import { dateSchema, emailSchema } from "@/validations/_utils"
import { mealSchema } from "./meals"
import { addonSchema } from "./addons"
import { calculateBillTotals } from "@/lib/utils"

const baseEventSchema = z.object({
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
  pax: z.int("Invalid Pax").positive("Pax must be greater than 0").nullable(),
  withFood: z.boolean(),
  amountPaid: z.number().nonnegative("Amount paid cannot be negative").catch(0),
  discountedTotal: z
    .number()
    .nonnegative("Discounted total cannot be negative")
    .nullable(),
  meal: mealSchema
    .pick({ items: true })
    .extend({ mealId: z.string() })
    .optional(),
  addons: z.array(addonSchema.extend({ _id: z.string().optional() })).optional(),
  venueId: z.string().min(1, "Please select a venue")
})

export const eventSchema = baseEventSchema.refine(
  (val) => isAfter(val.endTime, val.startTime),
  {
    message: "End time must be later than the start time",
    path: ["endTime"]
  }
)

export type EventSchema = z.infer<typeof eventSchema>

export const updateEventBillSchema = baseEventSchema
  .pick({
    discountedTotal: true,
    meal: true,
    addons: true,
    pax: true,
    amountPaid: true
  })
  .refine(
    (val) => {
      const { grandTotal } = calculateBillTotals({
        meal: val.meal,
        addons: val.addons,
        discountedTotal: val.discountedTotal
      })
      if (grandTotal <= 0) return true
      return val.amountPaid <= grandTotal
    },
    {
      message: "Amount paid cannot exceed the grand total",
      path: ["amountPaid"]
    }
  )

export type UpdateEventBillSchema = z.infer<typeof updateEventBillSchema>
