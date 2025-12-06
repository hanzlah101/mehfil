import { z } from "zod"
import { isAfter } from "date-fns"
import { dateSchema, emailSchema } from "@/validations/_utils"
import { mealSchema } from "./meals"
import { addonSchema } from "./addons"
import { calculateBillTotals } from "@/lib/utils"
import { EVENT_STATUS } from "@/lib/constants"

const baseEventSchema = z.object({
  notes: z.string().optional(),
  bookingDate: dateSchema("Please enter booking date"),
  startTime: dateSchema("Please enter start time"),
  endTime: dateSchema("Please enter end time"),
  status: z.enum(EVENT_STATUS, "Please select event status"),
  type: z.string().min(1, "Please select event type"),
  cancellationReason: z.string().optional(),
  customerName: z.string().min(1, "Please enter customer name"),
  guestArrival: z.string().optional(),
  customerEmail: z.union([z.literal(""), emailSchema.optional()]),
  customerPhone: z.string().optional(),
  customerCNIC: z.string().optional(),
  pax: z.int("Invalid Pax").positive("Pax must be greater than 0").nullable(),
  withFood: z.boolean(),
  amountPaid: z.number().nonnegative("Amount paid cannot be negative").catch(0),
  discountAmt: z
    .number()
    .nonnegative("Discount amount cannot be negative")
    .nullable(),
  meal: z
    .discriminatedUnion("type", [
      z.object({
        mealId: z.string(),
        type: z.literal("package"),
        pricePerHead: z
          .number()
          .positive("Price per head must be greater than 0"),
        items: z
          .array(z.object({ name: z.string().min(1) }))
          .optional()
      }),
      z.object({
        mealId: z.string(),
        type: z.literal("items"),
        items: z
          .array(
            z.object({
              name: z.string().min(1),
              unit: z.string().min(1),
              qty: z.number().positive(),
              unitPrice: z.number().nonnegative()
            })
          )
          .min(1, "Please add at least one item")
      })
    ])
    .optional(),
  addons: z
    .array(addonSchema.extend({ _id: z.string().optional() }))
    .optional(),
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
    discountAmt: true,
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
        discountAmt: val.discountAmt,
        pax: val.pax
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
