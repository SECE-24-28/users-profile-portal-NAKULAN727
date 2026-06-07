'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { useMutation } from '@apollo/client'
import { REGISTER } from '@/graphql/mutations'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [register_, { loading }] = useMutation(REGISTER)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await register_({ variables: data })
      const { token } = res.data.register
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
      toast.success('Account created!')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
      <p className="text-gray-500 text-sm mb-6">Join the Student Management System</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@school.com" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        <Select
          label="Role"
          {...register('role')}
          options={[{ value: 'STUDENT', label: 'Student' }, { value: 'ADMIN', label: 'Admin' }]}
          error={errors.role?.message}
        />
        <Button type="submit" loading={loading} className="w-full justify-center">Create Account</Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
      </p>
    </div>
  )
}
