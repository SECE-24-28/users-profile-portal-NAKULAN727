export type Role = 'ADMIN' | 'STUDENT'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export interface JwtPayload {
  userId: string
  email: string
  role: Role
}

export interface AuthContext {
  user: JwtPayload | null
}

export interface User {
  id: string
  email: string
  role: Role
  createdAt: string
  student?: Student | null
}

export interface Student {
  id: string
  profileImage?: string | null
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  dateOfBirth?: string | null
  gender?: Gender | null
  address?: string | null
  department: string
  createdAt: string
  updatedAt: string
  user?: User | null
}

export interface AuthPayload {
  token: string
  user: User
}

export interface PaginationInput {
  page?: number
  limit?: number
  search?: string
  department?: string
  gender?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface StudentsResult {
  students: Student[]
  total: number
  pages: number
}
