'use client'
import { useMutation } from '@apollo/client'
import { ADD_STUDENT } from '@/graphql/mutations'
import { StudentForm } from '@/components/students/StudentForm'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { StudentInput } from '@/lib/validations'
import Link from 'next/link'

export default function AddStudentPage() {
  const { user } = useAuth(true)
  const router = useRouter()
  const [addStudent, { loading }] = useMutation(ADD_STUDENT)

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">🚫</p>
        <p className="text-lg text-gray-600">Admins only</p>
      </div>
    )
  }

  const onSubmit = async (data: StudentInput & { profileImage?: string }) => {
    try {
      await addStudent({ variables: data })
      toast.success('Student added successfully!')
      router.push('/students')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add student')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/students" className="text-gray-400 hover:text-gray-600">←</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Student</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <StudentForm onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  )
}
