'use client'
import { useQuery } from '@apollo/client'
import { GET_STUDENTS } from '@/graphql/queries'
import { useState } from 'react'
import type { Student } from '@/types'

interface StudentsResult {
  getStudents: { students: Student[]; total: number; pages: number }
}

export function useStudents(initialLimit = 10) {
  const [filters, setFilters] = useState({
    page: 1, limit: initialLimit, search: '', department: '',
    gender: '', sortBy: 'createdAt', sortOrder: 'desc',
  })

  const { data, loading, error, refetch } = useQuery<StudentsResult>(GET_STUDENTS, {
    variables: filters,
    fetchPolicy: 'cache-and-network',
  })

  return {
    students: data?.getStudents.students ?? [],
    total: data?.getStudents.total ?? 0,
    pages: data?.getStudents.pages ?? 0,
    loading, error, filters, setFilters, refetch,
  }
}
