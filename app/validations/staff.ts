import { z } from "zod"
import { MANAGEABLE_PERMISSIONS } from "@/lib/permissions"

export const staffCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  permissions: z.array(z.enum(MANAGEABLE_PERMISSIONS))
})

export const staffUpdateSchema = staffCreateSchema.extend({
  password: z.undefined()
})

export type StaffCreateInput = z.infer<typeof staffCreateSchema>
export type StaffUpdateInput = z.infer<typeof staffUpdateSchema>
