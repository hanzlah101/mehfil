import { z } from "zod"

export const emailSchema = z.email({
  error: ({ input }) => (input ? "Invalid email address" : "Email is required")
})

export function dateSchema(err: string) {
  return z.date({
    error: ({ code }) => (code === "invalid_type" ? "Invalid date" : err)
  })
}

export function atLeastOne<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided"
    })
}
