'use client'
import { useQuery, useMutation } from '@apollo/client'
import { GET_STUDENT_BY_ID } from '@/graphql/queries'
import { DELETE_STUDENT } from '@/graphql/mutations'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState } from 'react'

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 mt-0.5">{value || '—'}</p>
    </div>
  )
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth(true)
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)
  const { data, loading } = useQuery(GET_STUDENT_BY_ID, { variables: { id: params.id } })
  const [deleteStudent, { loading: deleting }] = useMutation(DELETE_STUDENT)

  const student = data?.getStudentById

  const handleDelete = async () => {
    try {
      await deleteStudent({ variables: { id: params.id } })
      toast.success('Student deleted')
      router.push('/students')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!student) return <div className="text-center py-20 text-gray-400">Student not found</div>

  const isOwner = user?.student?.id === params.id
  const canEdit = user?.role === 'ADMIN' || isOwner

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/students" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
            {student.profileImage ? (
              <Image src={student.profileImage} alt={student.firstName} width={96} height={96}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold ring-4 ring-blue-50">
                {student.firstName[0]}{student.lastName[0]}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
              <p className="text-gray-500">{student.email}</p>
              <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-sm">
                {student.department}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            <Field label="Phone" value={student.phone} />
            <Field label="Gender" value={student.gender} />
            <Field label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : null} />
            <Field label="Address" value={student.address} />
            <Field label="Joined" value={new Date(student.createdAt).toLocaleDateString()} />
            <Field label="Last Updated" value={new Date(student.updatedAt).toLocaleDateString()} />
          </div>

          {canEdit && (
            <div className="flex gap-3 pt-4 border-t">
              <Link href={`/students/${student.id}/edit`} className="flex-1">
                <Button variant="ghost" className="w-full justify-center">Edit Profile</Button>
              </Link>
              {user?.role === 'ADMIN' && (
                <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
              )}
            </div>
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmModal
          title="Delete Student"
          message={`Delete ${student.firstName} ${student.lastName}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </>
  )
}
