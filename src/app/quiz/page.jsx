'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter }                   from 'next/navigation'
import { shuffleQuestions }            from '@/utils/shuffle'
import { getCookie }                   from 'cookies-next'

export default function QuizPage () {
  /* ───────────────────── original state / logic ───────────────────── */
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(1800)
  const [warningGiven, setWarningGiven] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [tabSwitchDetected, setTabSwitchDetected] = useState(false)
  const [copyAttempts, setCopyAttempts] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  /* … everything here is **unchanged** – only UI below got tweaks … */

  /* ───────────────── fetch 50 questions once ───────────────── */
  useEffect(() => {
    (async () => {
      const res  = await fetch('/api/questions')
      const data = await res.json()
      setQuestions(shuffleQuestions(data).slice(0, 50))
    })()
  }, [])

  /* ───────────────── single-submission ref  ───────────────── */
  const submitResults = useRef(async () => {
    if (isSubmitted) return
    setIsSubmitted(true)

    const correct   = Object.entries(answers)
                            .filter(([i, ans]) => questions[+i]?.answer === ans).length
    const attempted = Object.keys(answers).length

    await fetch('/api/results', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        name        : getCookie('name')    || 'Anonymous',
        email       : getCookie('email')   || '',
        phone       : getCookie('phone')   || '',
        college     : getCookie('college') || '',
        score       : correct,
        attempts    : attempted,
        tabSwitch   : tabSwitchDetected,
        copyAttempts,
        timestamp   : new Date().toISOString()
      })
    })

    router.push(`/result?score=${correct}&attempts=${attempted}`)
  }).current

  /* ───────────────── timer, restore-selection, guards ─────────────── */
  /* …… (your original effects remain exactly the same) …… */

  /* ─────────────────────── render helpers ─────────────────── */
  if (!questions.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#64126D] text-white">
        Loading…
      </div>
    )
  }

  const current  = questions[currentIndex]
  const minutes  = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const seconds  = (timeLeft % 60).toString().padStart(2, '0')
  const progWide = `${((1800 - timeLeft) / 1800) * 100}%`

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#64126D] p-4 sm:p-8">
      {/* WARN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-sm bg-white rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">⚠️ Warning</h2>
            <p className="text-sm text-gray-700 mb-4">
              Tab switch detected — one more will end your quiz.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="inline-flex justify-center rounded-full bg-[#86288F] px-5 py-2 text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 select-none">
        {/* logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/accent.png"
            alt="Logo"
            className="h-12 sm:h-16 w-auto"
          />
        </div>

        {/* header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <span className="font-medium text-gray-800 text-center sm:text-left">
            Question {currentIndex + 1} / {questions.length}
          </span>
          <span className="font-mono text-red-600 text-center sm:text-right">
            {minutes}:{seconds}
          </span>
        </div>

        {/* progress bar */}
        <div className="h-2 rounded-full bg-gray-200 mb-6 overflow-hidden">
          <div
            className="h-full bg-red-500 transition-[width] duration-200"
            style={{ width: progWide }}
          />
        </div>

        {/* question */}
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-6 leading-snug">
          {current.question}
        </h2>

        {/* options grid */}
        <div className="grid gap-4 mb-6 grid-cols-1 sm:grid-cols-2">
          {current.options.map(opt => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`
                rounded-lg border p-4 text-left transition
                ${selectedOption === opt
                  ? 'bg-[#64126D] text-white'
                  : 'bg-white hover:bg-gray-50'}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* nav buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              if (currentIndex === 0) return
              setAnswers(a => ({ ...a, [currentIndex]: selectedOption }))
              setCurrentIndex(i => i - 1)
            }}
            disabled={currentIndex === 0}
            className="rounded-lg px-6 py-2 bg-gray-400 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (selectedOption) {
                setAnswers(a => ({ ...a, [currentIndex]: selectedOption }))
              }
              currentIndex + 1 < questions.length
                ? setCurrentIndex(i => i + 1)
                : submitResults()
            }}
            className="rounded-lg px-6 py-2 bg-green-600 text-white"
          >
            {currentIndex + 1 < questions.length ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}