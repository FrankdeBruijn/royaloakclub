"use client"

import { useRouter } from 'next/navigation'

export default function BackButton({ className, children }: { className?: string, children: React.ReactNode }) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/database')
    }
  }

  return (
    <button onClick={handleBack} className={className}>
      {children}
    </button>
  )
}
