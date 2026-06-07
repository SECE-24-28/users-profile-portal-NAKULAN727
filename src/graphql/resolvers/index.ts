import { authResolvers } from './auth.resolver'
import { studentResolvers } from './student.resolver'

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...studentResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...studentResolvers.Mutation,
  },
}
