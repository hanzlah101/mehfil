import { z } from "zod"

export const emailSchema = z.email({
  error: ({ input }) => (input ? "Invalid email address" : "Email is required")
})

export function dateSchema(err: string) {
  return z.date({
    error: ({ code }) => (code === "invalid_type" ? "Invalid date" : err)
  })
}
