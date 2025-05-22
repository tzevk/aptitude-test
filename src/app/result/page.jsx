'use client'

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import { markQuizDone }        from '@/utils/attempt'
import Cookies                 from 'js-cookie'

export default function ResultPage () {
  const router              = useRouter()
  const [status, setStatus] = useState('Saving…')

  /* ------------- save result & mark attempt ----------------- */
  useEffect(() => {
    // read query-string
    const params   = new URLSearchParams(window.location.search)
    const score    = Number(params.get('score')    || 0)
    const attempts = Number(params.get('attempts') || 0)

    // mark cookie so quiz can’t be started again
    markQuizDone()

    const name    = Cookies.get('user_name')    || 'Anonymous'
    const email   = Cookies.get('user_email')   || ''
    const phone   = Cookies.get('user_phone')   || ''
    const college = Cookies.get('user_college') || ''
    const branch  = Cookies.get('user_branch')  || ''

    const save = async () => {
      try {
        await fetch('/api/results', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({
            name, email, phone, college, branch,
            score, attempts, timestamp : new Date().toISOString()
          })
        })
        setStatus('✅ Quiz Completed! Your result has been saved.')
      } catch {
        setStatus('❌ Could not save your result.')
      }
    }
    save()
  }, [])

  /* ------------- block back-navigation ---------------------- */
  useEffect(() => {
    history.pushState(null, '', window.location.href)

    const onPop = () => history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', onPop)

    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* ------------- auto-redirect home after 40 s -------------- */
  useEffect(() => {
    const id = setTimeout(() => router.replace('/'), 40_000)
    return () => clearTimeout(id)
  }, [router])

  /* -------------------------- UI ---------------------------- */
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 text-gray-700">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-lg text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  )
}