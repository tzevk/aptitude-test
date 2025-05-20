'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function ResultPage() {
  const searchParams = useSearchParams()
  const score = parseInt(searchParams.get('score') || '0')
  const attempts = parseInt(searchParams.get('attempts') || '0')

  const [status, setStatus] = useState('Saving...')

  useEffect(() => {
    const name = Cookies.get('user_name') || 'Anonymous'
    const email = Cookies.get('user_email') || 'no-email@example.com'
    const phone = Cookies.get('user_phone') || '0000000000'
    const college = Cookies.get('user_college') || 'Unknown'
    const branch = Cookies.get('user_branch') || 'General'

    const saveResult = async () => {
      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, email, phone, college, branch, score, attempts,
            timestamp: new Date().toISOString()
          }),
        })

        if (res.ok) {
          setStatus('Quiz Completed! Your result has been saved.')
        } else {
          setStatus('Failed to save your result.')
        }
      } catch (error) {
        setStatus('An error occurred while saving.')
      }
    }

    saveResult()
  }, [score, attempts])

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 40000) // 40 seconds
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed</h1>
        <p className="text-xl">{status}</p>
      </div>
    </div>
  )
}