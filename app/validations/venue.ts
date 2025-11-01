import { z } from "zod"

export const venueSchema = z.object({
  name: z.string().min(1, "Please enter venue name"),
  location: z.string().optional(),
  capacity: z
    .int({
      error: ({ code }) =>
        code === "invalid_type" ? "Please enter a valid capacity" : undefined
    })
    .positive("Capacity must be greater than 0"),
  color: z.string().min(1, "Please pick a color")
})

export type VenueSchema = z.infer<typeof venueSchema>
