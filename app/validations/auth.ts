import { z } from "zod"
import { emailSchema } from "@/validations/_utils"

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
})

export type LoginSchema = z.infer<typeof loginSchema>
