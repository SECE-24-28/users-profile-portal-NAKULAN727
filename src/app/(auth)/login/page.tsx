'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { useMutation } from '@apollo/client'
import { LOGIN } from '@/graphql/mutations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [login, { loading }] = useMutation(LOGIN)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await login({ variables: data })
      const { token } = res.data.login
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h1>
      <p className="text-gray-500 text-sm mb-6">Access your Student Management System</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="admin@school.com" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        <Button type="submit" loading={loading} className="w-full justify-center">Sign In</Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </div>
  )
}
