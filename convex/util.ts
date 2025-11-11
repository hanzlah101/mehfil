import { zQueryBuilder, zMutationBuilder, zActionBuilder } from "zodvex"
import { query, mutation, action } from "./_generated/server"
import {
  query as authQuery,
  mutation as authMutation,
  action as authAction
} from "./auth/_generated/server"

export const zq = zQueryBuilder(query)
export const zm = zMutationBuilder(mutation)
export const za = zActionBuilder(action)

export const authZQ = zMutationBuilder(authQuery)
export const authZM = zMutationBuilder(authMutation)
export const authZA = zMutationBuilder(authAction)
