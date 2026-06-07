'use client'
import Link from 'next/link'
import { useAuth, useLogout } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="text-lg font-bold text-blue-600">StudentMS</Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {user.role}
            </span>
            <Button variant="ghost" onClick={logout} className="text-sm py-1">Logout</Button>
          </>
        )}
      </div>
    </nav>
  )
}
