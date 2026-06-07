'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useState } from 'react'
import type { Student } from '@/types'

interface StudentCardProps {
  student: Student
  isAdmin: boolean
  onDelete: (id: string) => Promise<void>
  deleting?: boolean
}

export function StudentCard({ student, isAdmin, onDelete, deleting }: StudentCardProps) {
  const [confirm, setConfirm] = useState(false)
  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-3 hover:shadow-md transition">
        <div className="flex items-center gap-3">
          {student.profileImage ? (
            <Image src={student.profileImage} alt={student.firstName} width={48} height={48}
              className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{student.department}</span>
          {student.gender && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{student.gender}</span>}
        </div>
        <div className="flex gap-2 mt-auto">
          <Link href={`/students/${student.id}`} className="flex-1">
            <Button variant="ghost" className="w-full justify-center text-xs py-1">View</Button>
          </Link>
          {isAdmin && (
            <>
              <Link href={`/students/${student.id}/edit`} className="flex-1">
                <Button variant="ghost" className="w-full justify-center text-xs py-1">Edit</Button>
              </Link>
              <Button variant="danger" className="text-xs py-1" onClick={() => setConfirm(true)}>Del</Button>
            </>
          )}
        </div>
      </div>
      {confirm && (
        <ConfirmModal
          title="Delete Student"
          message={`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`}
          onConfirm={async () => { await onDelete(student.id); setConfirm(false) }}
          onCancel={() => setConfirm(false)}
          loading={deleting}
        />
      )}
    </>
  )
}
