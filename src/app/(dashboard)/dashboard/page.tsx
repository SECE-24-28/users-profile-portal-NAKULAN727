'use client'
import { useQuery } from '@apollo/client'
import { GET_STUDENTS } from '@/graphql/queries'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import type { Student } from '@/types'

interface StudentsData {
  getStudents: { students: Student[]; total: number; pages: number }
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className={`rounded-xl p-5 text-white ${color}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth(true)
  const { data, loading } = useQuery<StudentsData>(GET_STUDENTS, { variables: { limit: 5, sortBy: 'createdAt', sortOrder: 'desc' } })
  const { data: allData } = useQuery<StudentsData>(GET_STUDENTS, { variables: { limit: 1 } })

  const totalStudents = allData?.getStudents.total ?? 0
  const recentStudents = data?.getStudents.students ?? []

  const deptMap: Record<string, number> = {}
  recentStudents.forEach((s) => { deptMap[s.department] = (deptMap[s.department] || 0) + 1 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={totalStudents} color="bg-blue-600" />
        <StatCard label="Recent Additions" value={recentStudents.length} color="bg-green-600" />
        <StatCard label="Departments" value={Object.keys(deptMap).length} color="bg-purple-600" />
        <StatCard label="Your Role" value={user?.role ?? '—'} color="bg-orange-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Students</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : recentStudents.length === 0 ? (
            <p className="text-gray-400 text-sm">No students yet.</p>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {s.profileImage ? (
                      <Image src={s.profileImage} alt={s.firstName} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-gray-400">{s.department}</p>
                    </div>
                  </div>
                  <Link href={`/students/${s.id}`}>
                    <Button variant="ghost" className="text-xs py-1">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link href="/students"><Button variant="ghost" className="w-full justify-start">👥 View All Students</Button></Link>
            {user?.role === 'ADMIN' && (
              <Link href="/students/add"><Button variant="primary" className="w-full justify-start">➕ Add New Student</Button></Link>
            )}
          </div>

          {Object.keys(deptMap).length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Top Departments</h3>
              {Object.entries(deptMap).map(([dept, count]) => (
                <div key={dept} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span className="text-gray-600 truncate">{dept}</span>
                  <span className="font-medium text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
