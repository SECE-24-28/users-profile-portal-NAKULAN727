'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentSchema, type StudentInput } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useState } from 'react'
import type { Student } from '@/types'

const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Arts', 'Medicine', 'Law']

interface StudentFormProps {
  defaultValues?: Partial<Student>
  onSubmit: (data: StudentInput & { profileImage?: string }) => Promise<void>
  loading?: boolean
}

export function StudentForm({ defaultValues, onSubmit, loading }: StudentFormProps) {
  const [profileImage, setProfileImage] = useState<string | undefined>(defaultValues?.profileImage ?? undefined)
  const { register, handleSubmit, formState: { errors } } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? '',
      lastName: defaultValues?.lastName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      dateOfBirth: defaultValues?.dateOfBirth ? new Date(defaultValues.dateOfBirth).toISOString().split('T')[0] : '',
      gender: defaultValues?.gender ?? undefined,
      address: defaultValues?.address ?? '',
      department: defaultValues?.department ?? '',
    },
  })

  const submit = handleSubmit((data) => onSubmit({ ...data, profileImage }))

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex justify-center">
        <ImageUpload currentImage={defaultValues?.profileImage} onUpload={setProfileImage} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
        <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
        <Select
          label="Gender"
          {...register('gender')}
          options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]}
          placeholder="Select gender"
          error={errors.gender?.message}
        />
        <Select
          label="Department"
          {...register('department')}
          options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          placeholder="Select department"
          error={errors.department?.message}
        />
        <Input label="Address" {...register('address')} error={errors.address?.message} />
      </div>
      <Button type="submit" loading={loading} className="w-full justify-center">
        {defaultValues?.id ? 'Update Student' : 'Add Student'}
      </Button>
    </form>
  )
}
