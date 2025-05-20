'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function ResultPage() {
  const router = useRouter()
  const [score, setScore] = useState(null)
  const [attempts, setAttempts] = useState(null)
  const [status, setStatus] = useState('Saving...')

  // on mount, read query params from window.location
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sc = parseInt(params.get('score') || '0')
    const at = parseInt(params.get('attempts') || '0')
    setScore(sc)
    setAttempts(at)

    const name    = Cookies.get('user_name')    || 'Anonymous'
    const email   = Cookies.get('user_email')   || 'no-email@example.com'
    const phone   = Cookies.get('user_phone')   || '0000000000'
    const college = Cookies.get('user_college') || 'Unknown'
    const branch  = Cookies.get('user_branch')  || 'General'

    const saveResult = async () => {
      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            college,
            branch,
            score: sc,
            attempts: at,
            timestamp: new Date().toISOString()
          }),
        })

        if (res.ok) {
          setStatus('✅ Quiz Completed! Your result has been saved.')
        } else {
          setStatus('❌ Failed to save your result.')
        }
      } catch (error) {
        console.error(error)
        setStatus('❌ An error occurred while saving.')
      }
    }

    saveResult()
  }, [])

  // 40s redirect back to home
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 40000)
    return () => clearTimeout(timer)
  }, [router])

  // don't render until we know score/attempts
  if (score === null || attempts === null) {
    return null
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  )
}