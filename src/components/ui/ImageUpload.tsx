'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  currentImage?: string | null
  onUpload: (url: string) => void
}

export function ImageUpload({ currentImage, onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Invalid file type'); return
    }
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB'); return }

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { authorization: `Bearer ${token}` } : {},
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onUpload(data.url)
      toast.success('Image uploaded!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview} alt="Preview" width={128} height={128} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm text-center px-2">Click to upload</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {uploading && <p className="text-sm text-blue-500 animate-pulse">Uploading...</p>}
    </div>
  )
}
