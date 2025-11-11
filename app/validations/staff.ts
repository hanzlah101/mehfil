import { z } from "zod"
import { MANAGEABLE_PERMISSIONS } from "@/lib/permissions"

export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  permissions: z.array(z.enum(MANAGEABLE_PERMISSIONS))
})

export type StaffInput = z.infer<typeof staffSchema>
