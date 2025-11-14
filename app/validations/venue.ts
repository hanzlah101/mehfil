import { z } from "zod"

export const venueSchema = z.object({
  name: z.string().min(1, "Please enter venue name"),
  location: z.string().optional(),
  charges: z.number("Please enter venue charges"),
  color: z.string().min(1, "Please pick a color"),
  capacity: z
    .int({
      error: ({ code }) =>
        code === "invalid_type" ? "Please enter a valid capacity" : undefined
    })
    .positive("Capacity must be greater than 0")
})

export type VenueSchema = z.infer<typeof venueSchema>
