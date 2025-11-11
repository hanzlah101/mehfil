import { zQueryBuilder, zMutationBuilder, zActionBuilder } from "zodvex"
import { query, mutation, action } from "./_generated/server"

export const zq = zQueryBuilder(query)
export const zm = zMutationBuilder(mutation)
export const za = zActionBuilder(action)
