import { prisma } from '@/lib/prisma'
import type { AuthContext } from '@/types'
import { GraphQLError } from 'graphql'
import fs from 'fs'
import path from 'path'

type StudentArgs = {
  firstName?: string; lastName?: string; email?: string; phone?: string
  dateOfBirth?: string; gender?: 'MALE' | 'FEMALE' | 'OTHER'; address?: string
  department?: string; profileImage?: string
}

function requireAuth(user: AuthContext['user']) {
  if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHENTICATED' } })
}

export const studentResolvers = {
  Query: {
    getStudents: async (
      _: unknown,
      { page = 1, limit = 10, search, department, gender, sortBy = 'createdAt', sortOrder = 'desc' }: {
        page?: number; limit?: number; search?: string; department?: string
        gender?: string; sortBy?: string; sortOrder?: string
      },
      { user }: AuthContext
    ) => {
      requireAuth(user)
      const where: Record<string, unknown> = {}
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      }
      if (department) where.department = { contains: department, mode: 'insensitive' }
      if (gender) where.gender = gender

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { user: true },
        }),
        prisma.student.count({ where }),
      ])
      return { students, total, pages: Math.ceil(total / limit) }
    },

    getStudentById: async (_: unknown, { id }: { id: string }, { user }: AuthContext) => {
      requireAuth(user)
      const student = await prisma.student.findUnique({ where: { id }, include: { user: true } })
      if (!student) throw new GraphQLError('Student not found')
      if (user!.role === 'STUDENT' && student.userId !== user!.userId)
        throw new GraphQLError('Forbidden')
      return student
    },
  },

  Mutation: {
    addStudent: async (_: unknown, args: StudentArgs, { user }: AuthContext) => {
      requireAuth(user)
      if (user!.role !== 'ADMIN') throw new GraphQLError('Forbidden: Admins only')
      const existing = await prisma.student.findUnique({ where: { email: args.email! } })
      if (existing) throw new GraphQLError('Email already registered')
      return prisma.student.create({
        data: {
          ...args,
          dateOfBirth: args.dateOfBirth ? new Date(args.dateOfBirth) : undefined,
        } as Parameters<typeof prisma.student.create>[0]['data'],
        include: { user: true },
      })
    },

    updateStudent: async (
      _: unknown,
      { id, ...args }: { id: string } & StudentArgs,
      { user }: AuthContext
    ) => {
      requireAuth(user)
      const student = await prisma.student.findUnique({ where: { id } })
      if (!student) throw new GraphQLError('Student not found')
      if (user!.role === 'STUDENT' && student.userId !== user!.userId)
        throw new GraphQLError('Forbidden')
      return prisma.student.update({
        where: { id },
        data: {
          ...args,
          dateOfBirth: args.dateOfBirth ? new Date(args.dateOfBirth) : undefined,
        } as Parameters<typeof prisma.student.update>[0]['data'],
        include: { user: true },
      })
    },

    deleteStudent: async (_: unknown, { id }: { id: string }, { user }: AuthContext) => {
      requireAuth(user)
      if (user!.role !== 'ADMIN') throw new GraphQLError('Forbidden: Admins only')
      const student = await prisma.student.findUnique({ where: { id } })
      if (!student) throw new GraphQLError('Student not found')

      if (student.profileImage) {
        const filePath = path.join(process.cwd(), 'public', student.profileImage)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      }

      await prisma.student.delete({ where: { id } })
      return true
    },

    uploadProfileImage: async (
      _: unknown,
      { studentId, imageUrl }: { studentId: string; imageUrl: string },
      { user }: AuthContext
    ) => {
      requireAuth(user)
      const student = await prisma.student.findUnique({ where: { id: studentId } })
      if (!student) throw new GraphQLError('Student not found')
      if (user!.role === 'STUDENT' && student.userId !== user!.userId)
        throw new GraphQLError('Forbidden')

      if (student.profileImage) {
        const old = path.join(process.cwd(), 'public', student.profileImage)
        if (fs.existsSync(old)) fs.unlinkSync(old)
      }

      return prisma.student.update({
        where: { id: studentId },
        data: { profileImage: imageUrl },
        include: { user: true },
      })
    },
  },
}
