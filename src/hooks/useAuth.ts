'use client'
import { useQuery } from '@apollo/client'
import { GET_CURRENT_USER } from '@/graphql/queries'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { User } from '@/types'

export function useAuth(redirectIfUnauthenticated = false) {
  const router = useRouter()
  const { data, loading, error } = useQuery<{ getCurrentUser: User }>(GET_CURRENT_USER, {
    skip: typeof window === 'undefined' || !localStorage.getItem('token'),
  })

  useEffect(() => {
    if (!loading && redirectIfUnauthenticated && !data?.getCurrentUser) {
      router.push('/login')
    }
  }, [loading, data, redirectIfUnauthenticated, router])

  return { user: data?.getCurrentUser ?? null, loading, error }
}

export function useLogout() {
  const router = useRouter()
  return () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }
}
