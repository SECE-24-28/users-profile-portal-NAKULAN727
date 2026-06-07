'use client'
import { useMutation } from '@apollo/client'
import { DELETE_STUDENT } from '@/graphql/mutations'
import { useStudents } from '@/hooks/useStudents'
import { useAuth } from '@/hooks/useAuth'
import { StudentCard } from '@/components/students/StudentCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useCallback } from 'react'

const DEPT_OPTIONS = [
  { value: '', label: 'All Departments' },
  ...['Computer Science','Mathematics','Physics','Chemistry','Biology','Engineering','Business','Arts','Medicine','Law']
    .map((d) => ({ value: d, label: d })),
]

export default function StudentsPage() {
  const { user } = useAuth(true)
  const { students, total, pages, loading, filters, setFilters, refetch } = useStudents()
  const [deleteStudent, { loading: deleting }] = useMutation(DELETE_STUDENT)

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteStudent({ variables: { id } })
      toast.success('Student deleted')
      refetch()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }, [deleteStudent, refetch])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        {user?.role === 'ADMIN' && (
          <Link href="/students/add"><Button>➕ Add Student</Button></Link>
        )}
      </div>

      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          className="min-w-[200px] flex-1"
        />
        <Select
          options={DEPT_OPTIONS}
          value={filters.department}
          onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value, page: 1 }))}
          className="min-w-[180px]"
          placeholder=""
        />
        <Select
          options={[
            { value: '', label: 'All Genders' },
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' },
          ]}
          value={filters.gender}
          onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value, page: 1 }))}
          className="min-w-[140px]"
          placeholder=""
        />
        <Select
          options={[
            { value: 'createdAt', label: 'Newest First' },
            { value: 'firstName', label: 'Name A-Z' },
            { value: 'department', label: 'Department' },
          ]}
          value={filters.sortBy}
          onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
          className="min-w-[150px]"
          placeholder=""
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-4 h-48 animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">👥</p>
          <p className="text-lg">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map((s) => (
            <StudentCard
              key={s.id}
              student={s}
              isAdmin={user?.role === 'ADMIN'}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      )}

      <Pagination
        page={filters.page}
        pages={pages}
        total={total}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  )
}
