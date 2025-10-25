import { z } from "zod"

export const emailSchema = z.email({
  error: ({ input }) => (input ? "Invalid email address" : "Email is required")
})

/**
 * Create a Zod date schema that maps validation error codes to specific messages.
 *
 * @param err - Message to return when the validation error code is not `"invalid_type"`
 * @returns A Zod date schema that yields `"Invalid date"` for `invalid_type` errors and `err` for other errors
 */
export function dateSchema(err: string) {
  return z.date({
    error: ({ code }) => (code === "invalid_type" ? "Invalid date" : err)
  })
}