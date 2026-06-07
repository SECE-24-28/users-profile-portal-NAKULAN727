'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/students', label: '👥 Students' },
  { href: '/students/add', label: '➕ Add Student', adminOnly: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-1">
      {navItems.map((item) => {
        if (item.adminOnly && user?.role !== 'ADMIN') return null
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm transition ${active ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            {item.label}
          </Link>
        )
      })}
    </aside>
  )
}
