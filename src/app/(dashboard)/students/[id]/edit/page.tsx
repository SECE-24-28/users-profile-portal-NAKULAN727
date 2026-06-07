'use client'
import { useQuery, useMutation } from '@apollo/client'
import { GET_STUDENT_BY_ID } from '@/graphql/queries'
import { UPDATE_STUDENT } from '@/graphql/mutations'
import { StudentForm } from '@/components/students/StudentForm'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { StudentInput } from '@/lib/validations'

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const { user } = useAuth(true)
  const router = useRouter()
  const { data, loading } = useQuery(GET_STUDENT_BY_ID, { variables: { id: params.id } })
  const [updateStudent, { loading: updating }] = useMutation(UPDATE_STUDENT)

  const student = data?.getStudentById

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!student) return <div className="text-center py-20 text-gray-400">Student not found</div>

  const isOwner = user?.student?.id === params.id
  if (user && user.role !== 'ADMIN' && !isOwner) {
    return <div className="text-center py-20 text-gray-400">You do not have permission to edit this profile</div>
  }

  const onSubmit = async (data: StudentInput & { profileImage?: string }) => {
    try {
      await updateStudent({ variables: { id: params.id, ...data } })
      toast.success('Student updated!')
      router.push(`/students/${params.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/students/${params.id}`} className="text-gray-400 hover:text-gray-600">←</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <StudentForm defaultValues={student} onSubmit={onSubmit} loading={updating} />
      </div>
    </div>
  )
}
