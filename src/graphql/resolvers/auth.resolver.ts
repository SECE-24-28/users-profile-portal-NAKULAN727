import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import type { AuthContext } from '@/types'
import { GraphQLError } from 'graphql'

export const authResolvers = {
  Mutation: {
    register: async (
      _: unknown,
      { email, password, role }: { email: string; password: string; role?: 'ADMIN' | 'STUDENT' }
    ) => {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) throw new GraphQLError('Email already in use')

      const hashed = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: { email, password: hashed, role: role || 'STUDENT' },
        include: { student: true },
      })

      const token = signToken({ userId: user.id, email: user.email, role: user.role })
      return { token, user }
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email }, include: { student: true } })
      if (!user) throw new GraphQLError('Invalid credentials')

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) throw new GraphQLError('Invalid credentials')

      const token = signToken({ userId: user.id, email: user.email, role: user.role })
      return { token, user }
    },
  },

  Query: {
    getCurrentUser: async (_: unknown, __: unknown, { user }: AuthContext) => {
      if (!user) throw new GraphQLError('Unauthorized')
      return prisma.user.findUnique({ where: { id: user.userId }, include: { student: true } })
    },
  },
}
